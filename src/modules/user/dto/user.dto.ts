import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com', description: 'email' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: Role,
    default: Role.CUSTOMER,
  })
  @IsEnum(Role)
  role!: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
