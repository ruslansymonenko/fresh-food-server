import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  perPage?: string;
}
