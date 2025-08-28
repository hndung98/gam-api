import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'johndoe', description: 'username' })
  @MinLength(3)
  username!: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @MinLength(3)
  password!: string;
}

export class SignUpDto {}

export class UpdateProfileDto {}
