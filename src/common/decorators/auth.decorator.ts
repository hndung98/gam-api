import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from './roles.decorator';

interface AuthOptions {
  description?: string;
}

export function Auth(roleOrRoles?: Role | Role[], options?: AuthOptions) {
  const roles = Array.isArray(roleOrRoles)
    ? roleOrRoles
    : roleOrRoles
      ? [roleOrRoles]
      : [];

  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    Roles(...roles),
    options?.description
      ? ApiOperation({ summary: options.description })
      : (target: any, key: any, desc: any) => desc,
  );
}

export const CurrentUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
