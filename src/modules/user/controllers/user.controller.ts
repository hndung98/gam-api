import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() query: PaginationDto): Promise<UserEntity[]> {
    return this.userService.getUsers(query);
  }
}
