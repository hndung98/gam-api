import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/common/constants/auth.const';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenBlacklistService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
