# ---------- Build stage ----------
FROM node:20-slim AS builder
WORKDIR /app

# Cài gói cần cho build (openssl, python3, build tools nếu có native deps)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

# Chỉ copy file khai báo deps để cache tốt
COPY package*.json ./
RUN npm ci

# Tạo Prisma Client trước khi build Nest
COPY prisma ./prisma
RUN npx prisma generate

# Copy source và build NestJS
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Chỉ copy các file cần chạy
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Prisma schema (client đã generate sẵn ở build-stage)
COPY --from=builder /app/prisma ./prisma

# Build output
COPY --from=builder /app/dist ./dist

# Không bake .env vào image (dùng env từ máy local/AWS)
# Thêm healthcheck (nếu app có /health)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT||8080) + '/health').then(r=>{if(r.ok)process.exit(0);process.exit(1)}).catch(()=>process.exit(1))"

# Chạy user không phải root cho an toàn
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
CMD ["node", "dist/main.js"]