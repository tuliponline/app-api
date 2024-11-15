import { IsString, IsNotEmpty, IsMongoId, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DomainStatus } from '../schemas/template-domain.schema';
import { Types } from 'mongoose';
import { UserRole } from 'src/user/schemas/user.schema';

export class CreateTemplateDomainDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly domainName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly templateApp: string;
}
