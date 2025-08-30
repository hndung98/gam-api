import { Module } from '@nestjs/common';
import { GoogleAdsController } from './controllers/google-ads.controller';
import { GoogleAdsService } from './services/google-ads.service';

@Module({
  controllers: [GoogleAdsController],
  providers: [GoogleAdsService],
})
export class GoogleAdsModule {}
