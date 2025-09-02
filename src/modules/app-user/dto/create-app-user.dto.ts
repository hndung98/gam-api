import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { AppUserStatusEnum } from './app-user-status.enum';


export class CreateAppUserDto {
  @IsEmail()
  email!: string;

  @IsEnum(AppUserStatusEnum)
  status: AppUserStatusEnum = AppUserStatusEnum.active;

  // Nếu bạn muốn cho phép set người tạo:
  @IsOptional()
  creatorId?: string; // BigInt dưới DB; nhận string để tránh mất chính xác
}
