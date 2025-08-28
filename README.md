# Các bước chạy project ở local

## Cài đặt thư viện

- Chạy lệnh cài đặt các packages

```bash
$ npm install
```

## Thiết lập env variables

Đổi tên file .env.example thành .env (hoặc tạo mới .env có nội dung giống file .env.example). Sau đó sửa file .env như sau:

- Set giá trị DATABASE_URL là đường connection string của database

ví dụ:

```bash
$ DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Nếu ở local không có database thì có thể dùng dịch vụ database miễn phí của Postgre như Neon, Supabase v.v

- Set giá trị JWT_SECRET_KEY là một chuỗi ngẫu nhiên, tốt nhất là 32 ký tự, có thể dùng lệnh openssl để generate, hoặc nhanh nhất là truy cập [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

ví dụ

```bash
$ JWT_SECRET_KEY=8c7a59c8814d35eaded23bbd848a3e32
```

- Set giá trị PORT ở local, ví dụ

ví dụ

```bash
$ PORT=5000
```

Các giá trị còn lại để mặc định, hoặc để trống

## Kết nối Posgree Server và tạo database

- Chạy lệnh sau để tạo database trên Postgres Server và generate script trong source code

```bash
$ npm run db:migrate
```

hoặc dùng lệnh gốc: npx prisma migrate dev

## Compile and run

- Chạy lệnh sau và khởi tạo

```bash
# watch mode
$ npm run dev
```
