import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  collaborators: number;

  @IsNumber()
  storage: number;

  @IsNumber()
  pages: number;

  @IsNumber()
  free_domains: number;

  @IsString()
  marketing_suite: string;

  @IsString()
  site_analytics: string;

  @IsString()
  ecommerce: string;

  @IsBoolean()
  is_recommended: boolean;

  @IsBoolean()
  is_active: boolean;
}
