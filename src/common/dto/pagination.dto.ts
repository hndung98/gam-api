import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 1, required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ default: 10, required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number = 10;
}
