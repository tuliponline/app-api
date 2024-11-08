// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { AdminStrategy } from './admin.strategy';

// @Injectable()
// export class AdminGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const isAdminRoute = this.reflector.get<boolean>(
//       'isAdmin',
//       context.getHandler(),
//     );
//     if (!isAdminRoute) {
//       return true; // Allow non-admin routes
//     }

//     const request = context.switchToHttp().getRequest();
//     const user = request.user; // Assuming JwtStrategy sets 'user' in request object

//     // Check if the user is an admin using the AdminStrategy
//     if (!user || !user.isAdmin) {
//       throw new ForbiddenException('Admin access required');
//     }
//     return true;
//   }
// }

import { 
    Injectable, 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException 
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const isAdmin = await this.userService.isAdmin(user.userId);
    if (!isAdmin) {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}

