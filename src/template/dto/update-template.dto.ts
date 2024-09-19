import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { IsString, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageFor, PageType, TemplateStatus } from '../schemas/template.schema';
import { Types } from 'mongoose';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @IsMongoId()
  @ApiProperty()
  templateId: Types.ObjectId;

  @IsString()
  @ApiProperty({ example: 'ME || CUSTOMER' })
  readonly pageFor: PageFor;

  @IsString()
  @ApiProperty({
    example:
      'ECOMMERCE || MARKETING || SALEPAGE || BLOG || NEWSLETTER || PORTFOLIO',
  })
  readonly pageType: PageType;

  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly image: string;

  @IsArray()
  @ApiProperty()
  readonly components: [];

  @IsArray()
  @ApiProperty()
  readonly pages: [];

  @IsString()
  @ApiProperty({ example: 'PUBLISH || DRAFT || DISABLE' })
  readonly status: TemplateStatus;
}
