import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryAppUserDto } from './dto/query-app-user.dto';

function toBigIntOrNull(v?: string) {
  if (v === undefined || v === null) return null;
  if (v === '') return null;
  try { return BigInt(v); } catch { throw new BadRequestException('Invalid BigInt id'); }
}

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppUserDto) {
    const creatorId = toBigIntOrNull(dto.creatorId);
    if (creatorId) {
      const exists = await this.prisma.appUser.findUnique({ where: { id: creatorId } });
      if (!exists) throw new BadRequestException('creatorId not found');
    }
    try {
      const created = await this.prisma.appUser.create({
        data: {
          email: dto.email,
          status: dto.status as unknown as any, // map sang Prisma enum
          creator_id: creatorId ?? undefined,
        },
      });
      return this.serializeBigInt(created);
    } catch (e: any) {
      if (e.code === 'P2002') throw new BadRequestException('email already exists');
      throw e;
    }
  }

  async findAll(q: QueryAppUserDto) {
    const {
      search, status, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc',
      includeDeleted = false, includeAudit = false,
    } = q;

    const where: any = {};
    if (!includeDeleted) where.is_deleted = false;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const include = includeAudit
      ? { creator: true, modifier: true } // nếu đã model self-relations ở Prisma
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.appUser.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appUser.count({ where }),
    ]);

    return {
      data: items.map(this.serializeBigInt),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), sortBy, sortOrder },
    };
  }

  async findOne(id: string) {
    const found = await this.prisma.appUser.findUnique({ where: { id: toBigIntOrNull(id) as bigint } });
    if (!found) throw new NotFoundException('AppUser not found');
    return this.serializeBigInt(found);
  }

  async update(id: string, dto: UpdateAppUserDto) {
    const modifierId = toBigIntOrNull(dto.modifierId);
    if (modifierId) {
      const exists = await this.prisma.appUser.findUnique({ where: { id: modifierId } });
      if (!exists) throw new BadRequestException('modifierId not found');
    }

    try {
      const updated = await this.prisma.appUser.update({
        where: { id: toBigIntOrNull(id) as bigint },
        data: {
          email: dto.email,
          status: dto.status as unknown as any,
          modifier_id: modifierId ?? undefined,
        },
      });
      return this.serializeBigInt(updated);
    } catch (e: any) {
      if (e.code === 'P2002') throw new BadRequestException('email already exists');
      throw e;
    }
  }

  async softDelete(id: string) {
    const updated = await this.prisma.appUser.update({
      where: { id: toBigIntOrNull(id) as bigint },
      data: { is_deleted: true, deleted_at: new Date() },
    });
    return this.serializeBigInt(updated);
  }

  async restore(id: string) {
    const updated = await this.prisma.appUser.update({
      where: { id: toBigIntOrNull(id) as bigint },
      data: { is_deleted: false, deleted_at: null },
    });
    return this.serializeBigInt(updated);
  }

  private serializeBigInt<T extends Record<string, any>>(obj: T) {
    // Chuyển mọi BigInt -> string để JSON không lỗi
    return JSON.parse(JSON.stringify(obj, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ));
  }
}
