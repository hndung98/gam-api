import { Controller, Get, Query } from '@nestjs/common';
import { GoogleAdsService } from '../services/google-ads.service';

@Controller('google-ads')
export class GoogleAdsController {
  constructor(private readonly googleAdsService: GoogleAdsService) {}

  @Get('campaigns')
  async getCampaigns(@Query('customerId') customerId: string) {
    return this.googleAdsService.getCampaigns(customerId);
  }
}
