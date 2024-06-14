import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decoratos/auth.decorator';
import { ReviewDto } from './dto/review.dto';
import { CurrentUser } from '../auth/decoratos/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('create/:productId')
  @Auth()
  async create(
    @CurrentUser('id') id: string,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(id, productId, dto);
  }

  @Get('get-all')
  async getAll() {
    return this.reviewService.getAll();
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.reviewService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update/:id')
  @Auth()
  async update(@Param('id') id: string, @Body() dto: ReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }
}
