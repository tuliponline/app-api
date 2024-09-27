// import { Injectable, ForbiddenException } from '@nestjs/common';
// import { JwtStrategy } from './jwt.strategy';
// import { ConfigService } from '@nestjs/config';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class AdminStrategy extends JwtStrategy {
//   constructor(
//     configService: ConfigService,
//     private readonly userService: UserService,
//   ) {
//     super(configService);
//   }

//   async validate(payload: any) {
//     const user = await super.validate(payload); // Call base strategy's validate
//     const isAdmin = await this.userService.isAdmin(user.userId);
//     if (!isAdmin) {
//       throw new ForbiddenException(
//         "You don't have permission to access this route",
//       );
//     }
//     return user;
//   }
// }
