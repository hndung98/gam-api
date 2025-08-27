import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/confige.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          targets: [
            {
              target: 'pino/file',
              options: { destination: 'logs/app.log', mkdir: true },
            },
            {
              target: 'pino-pretty',
              options: { colorize: true },
            },
          ],
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
