import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, defaultPerPage: number = 30) {
    const page: number = dto.page ? +dto.page : 1;
    const perPage: number = dto.perPage ? +dto.perPage : defaultPerPage;

    const skip: number = (page - 1) * perPage;

    return { perPage, skip };
  }
}
