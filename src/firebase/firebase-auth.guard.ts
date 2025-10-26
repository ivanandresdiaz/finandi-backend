/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/firebase-auth.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  // ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { Request } from 'express';
// import * as admin from 'firebase-admin';
// import { Roles } from './roles.enum';
// import { NIVEL_PERMISOS } from './permissions-map';
import { FirebaseService } from './firebase.service';

export function FirebaseAuthGuard(): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private readonly firebaseService: FirebaseService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = await context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token no válido');
      }
      const token = authHeader.split(' ')[1];
      try {
        const decodedToken = await this.firebaseService
          .getAuth()
          .verifyIdToken(token);
        if (!decodedToken) {
          throw new UnauthorizedException('Token inválido o expirado');
        }
        return true;
        // const role = decodedToken.role as Roles;
        // const blocked = decodedToken.blocked || false;
        // if (!role) {
        //   throw new UnauthorizedException('Rol no definido');
        // }
        // if (blocked) {
        //   throw new ForbiddenException('Usuario bloqueado');
        // }
        // const rolesPermitidos = NIVEL_PERMISOS[role];
        // const tienePermiso = rolesPermitidos.includes(minRole);
        // if (!tienePermiso) {
        //   throw new ForbiddenException('No tienes permisos para esta acción');
        // }
        // request['user'] = decodedToken;
        // request['uid'] = decodedToken.uid;
        // request['role'] = role;
        return true;
      } catch (err) {
        console.log('err', err);
        throw new UnauthorizedException('Token inválido o expirado');
      }
    }
  }

  return mixin(RoleGuardMixin);
}
