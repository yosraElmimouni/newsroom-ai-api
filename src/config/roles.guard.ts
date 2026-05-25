import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/enums/Roles';

export const ROLES_KEY = 'roles';

// Décorateur à utiliser sur les controllers
import { SetMetadata } from '@nestjs/common';
export const RequireRoles = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true; // route non protégée

    const { user } = context.switchToHttp().getRequest();
    return required.includes(user?.role);
  }
}