import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageFor, PageType, TemplateStatus } from '../schemas/template.schema';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @IsString()
  @ApiProperty()
  readonly pageFor: PageFor;

  @IsString()
  @ApiProperty()
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
  @ApiProperty()
  readonly status: TemplateStatus;
}
