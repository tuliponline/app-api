import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly price: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly collaborators: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly storage: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly pages: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly free_domains: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly marketing_suite: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly site_analytics: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly ecommerce: string;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly is_recommended: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly is_active: boolean;
}
