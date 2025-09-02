import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { AppUserStatusEnum } from './app-user-status.enum';

export class QueryAppUserDto {
  @IsOptional() @IsString()
  search?: string; // tìm theo email

  @IsOptional() @IsEnum(AppUserStatusEnum)
  status?: AppUserStatusEnum;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 10;

  @IsOptional() @IsString()
  sortBy?: 'created_at' | 'email' | 'status' = 'created_at';

  @IsOptional() @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional() @IsBoolean()
  @Type(() => Boolean)
  includeDeleted?: boolean = false;

  @IsOptional() @IsBoolean()
  @Type(() => Boolean)
  includeAudit?: boolean = false; // include creator/modifier
}
