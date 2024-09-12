import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'wBkQJ@example.com' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly password: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @ApiProperty({ example: 'ADMIN || USER' })
  readonly userRole: UserRole;
}
