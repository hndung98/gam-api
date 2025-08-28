import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestIdMiddleware } from './common/middlewares/request.middleware';
import { ConfigModule } from './config/confige.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => {
          return (req.headers['x-request-id'] as string) || uuid();
        },
        customProps: (req) => ({
          requestId: req.headers['x-request-id'],
        }),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
