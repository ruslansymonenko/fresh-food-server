import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Auth } from '../auth/decoratos/auth.decorator';
import { CurrentUser } from '../auth/decoratos/user.decorator';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('main')
  @Auth()
  getMain(@CurrentUser('id') id: string) {
    return this.statisticService.getMain(id);
  }
}
