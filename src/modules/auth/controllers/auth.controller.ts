import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from 'src/app.service';
import { Auth, CurrentUser } from '../decorators/auth.decorator';
import { SignInDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SignInDto })
  @Post('login')
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @Auth()
  @Post('logout')
  signOut(@Req() req: Request) {
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ')[1];
    return this.authService.signOut(token);
  }

  @Auth()
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
