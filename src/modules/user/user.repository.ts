import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async findMany(params: { skip?: number; take?: number }): Promise<User[]> {
    const { skip, take } = params;
    const users = await this.prisma.user.findMany({
      skip,
      take,
    });
    return users;
  }
}
