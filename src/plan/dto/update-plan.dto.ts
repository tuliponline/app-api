import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsString()
  name: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  collaborators: number;

  @IsNumber()
  @ApiProperty()
  storage: number;

  @IsNumber()
  @ApiProperty()
  pages: number;

  @IsNumber()
  @ApiProperty()
  free_domains: number;

  @IsString()
  @ApiProperty()
  marketing_suite: string;

  @IsString()
  @ApiProperty()
  site_analytics: string;

  @IsString()
  @ApiProperty()
  ecommerce: string;

  @IsBoolean()
  @ApiProperty()
  is_recommended: boolean;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;
}
