import { PartialType } from '@nestjs/mapped-types';
import { CreateAppUserDto } from './create-app-user.dto';
import { IsEnum, IsOptional, IsEmail } from 'class-validator';
import { AppUserStatusEnum } from './app-user-status.enum';

export class UpdateAppUserDto extends PartialType(CreateAppUserDto) {
  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsEnum(AppUserStatusEnum)
  status?: AppUserStatusEnum;

  @IsOptional()
  modifierId?: string; // BigInt string
}
