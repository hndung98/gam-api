import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dto/auth.dto';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(private tokenBlacklist: TokenBlacklistService) {}

  /**
   * Handle user login
   * @param data
   * @returns
   */
  async signIn(data: SignInDto) {
    // TODO: login by username and password or using OAuth2
    if (data.username && data.password)
      throw new UnauthorizedException('Invalid password!');
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Handle user log out
   * @param token
   * @returns
   */
  async signOut(
    token?: string,
  ): Promise<{ success?: boolean; message?: string }> {
    try {
      if (!token) return { message: 'Token not found!' };
      const res = await this.tokenBlacklist.blacklist(token);
      if (!res) return { message: 'Token has been blacklisted!' };
      return { success: true };
    } catch (error) {
      return { message: 'Internal Server Error!' };
    }
  }
}
