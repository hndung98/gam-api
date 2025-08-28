import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { exclude } from 'src/common/utils/select.util';
import { UserEntity, UserOmittedKeys } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(dto: PaginationDto): Promise<UserEntity[]> {
    const { page, perPage } = dto;
    const users = await this.userRepository.findMany({
      skip: page,
      take: perPage,
    });
    return users.map((user) => exclude(user, UserOmittedKeys));
  }
}
