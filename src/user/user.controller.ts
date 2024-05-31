import { Controller, Get, HttpCode, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decoratos/auth.decorator';
import { CurrentUser } from '../auth/decoratos/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(@CurrentUser('id') id: string, @Param('productId') productId: string) {
    return this.userService.toogleFavorite(id, productId);
  }
}
