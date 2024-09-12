import { IsString, IsNotEmpty, IsMongoId, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageFor, PageType, TemplateStatus } from '../schemas/template.schema';
import { Types } from 'mongoose';
import { UserRole } from 'src/user/schemas/user.schema';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly pageFor: PageFor;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly pageType: PageType;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly templateId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly image: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly components: [];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly pages: [];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly status: TemplateStatus;

  readonly createBy: UserRole;
}
