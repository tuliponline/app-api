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
  discount: number;

  @IsNumber()
  @ApiProperty()
  storage: number;

  @IsNumber()
  @ApiProperty()
  pages: number;

  @IsNumber()
  @ApiProperty()
  salePage: number;
  @IsNumber()
  @ApiProperty()
  duration: number;

  @IsBoolean()
  @ApiProperty()
  isRecommended: boolean;

  @IsBoolean()
  @ApiProperty()
  isActive: boolean;
}
