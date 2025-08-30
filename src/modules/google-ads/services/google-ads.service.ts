import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Customer, GoogleAdsApi, ReportOptions } from 'google-ads-api';

interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  developerToken: string;
  refreshToken: string;
  loginCustomerId: string;
}

@Injectable()
export class GoogleAdsService {
  private readonly client: GoogleAdsApi;
  private readonly config: GoogleAdsConfig;

  constructor() {
    this.config = {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      developerToken: process.env.GOOGLE_DEVELOPER_TOKEN ?? '',
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN ?? '',
      loginCustomerId: process.env.GOOGLE_LOGIN_CUSTOMER_ID ?? '',
    };

    this.client = new GoogleAdsApi({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      developer_token: this.config.developerToken,
    });
  }

  async getCampaigns(customerId: string) {
    try {
      const customer: Customer = this.client.Customer({
        customer_id: customerId,
        login_customer_id: this.config.loginCustomerId,
        refresh_token: this.config.refreshToken,
      }) as unknown as Customer;

      const options: ReportOptions = {
        entity: 'campaign',
        attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
        constraints: [{ 'campaign.status': 'ENABLED' }],
      };

      const campaigns = await customer.report(options);
      return campaigns;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Google Ads API error: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error occurred while fetching campaigns',
      );
    }
  }

  async getCampaignsUsingQuery(customerId: string) {
    try {
      const customer: Customer = this.client.Customer({
        customer_id: customerId,
        login_customer_id: this.config.loginCustomerId,
        refresh_token: this.config.refreshToken,
      }) as unknown as Customer;

      const campaigns = await customer.query(`
        SELECT 
          campaign.id, 
          campaign.name,
          campaign.bidding_strategy_type,
          campaign_budget.amount_micros,
          metrics.cost_micros,
          metrics.clicks,
          metrics.impressions,
          metrics.all_conversions
        FROM 
          campaign
        WHERE
          campaign.status = "ENABLED"
        LIMIT 20
      `);
      return campaigns;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Google Ads API error: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error occurred while fetching campaigns',
      );
    }
  }
}
