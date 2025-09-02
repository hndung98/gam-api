import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { SignInDto } from '../dto/auth.dto';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private jwtService: JwtService,
    private tokenBlacklist: TokenBlacklistService,
  ) {}

  async verifyGoogleToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) throw new UnauthorizedException('Invalid Google token');

    const { sub, email, name, picture } = payload;
    const user = { id: sub, email, name, picture };
    const access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { access_token, user };
  }

  /**
   * Handle user login
   * @param data
   * @returns
   */
  async signIn(data: SignInDto) {
    // TODO: login by username and password or using OAuth2
    if (data.username && data.password) throw new UnauthorizedException('Invalid password!');
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Handle user log out
   * @param token
   * @returns
   */
  async signOut(token?: string): Promise<{ success?: boolean; message?: string }> {
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
