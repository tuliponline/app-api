import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDomainDto } from './create-template-domain.dto';
import { IsString, IsArray, IsMongoId, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DomainStatus } from '../schemas/template-domain.schema';
import { Types } from 'mongoose';

export class UpdateTemplateDomainDto extends PartialType(CreateTemplateDomainDto) {
  @IsString()
  @ApiProperty()
  readonly domainName: string;

  @IsEnum(DomainStatus)
  @IsString()
  @ApiProperty({ example: 'PENDING || ACTIVE || INACTIVE' })
  readonly status: DomainStatus;

  @IsString()
  @ApiProperty()
  readonly templateApp: string;

  @IsBoolean()
  @ApiProperty()
  readonly isEnable: boolean;
}
