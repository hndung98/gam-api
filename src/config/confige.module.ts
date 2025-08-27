import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(5000),
        DATABASE_URL: Joi.string().uri().required(),
        JWT_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
