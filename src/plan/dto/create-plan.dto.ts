import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
  @IsNumber()
  @IsNotEmpty()
  readonly collaborators: number;
  @IsNumber()
  @IsNotEmpty()
  readonly storage: number;
  @IsNumber()
  @IsNotEmpty()
  readonly pages: number;
  @IsNumber()
  @IsNotEmpty()
  readonly free_domains: number;
  @IsString()
  @IsNotEmpty()
  readonly marketing_suite: string;
  @IsString()
  @IsNotEmpty()
  readonly site_analytics: string;
  @IsString()
  @IsNotEmpty()
  readonly ecommerce: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly is_recommended: boolean;
  @IsBoolean()
  @IsNotEmpty()
  readonly is_active: boolean;
}
