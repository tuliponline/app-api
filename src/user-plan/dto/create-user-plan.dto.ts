import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserPlanDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
  @IsMongoId()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  collaborators: number;
  @IsNumber()
  @IsNotEmpty()
  storage: number;
  @IsNumber()
  @IsNotEmpty()
  pages: number;
  @IsNumber()
  @IsNotEmpty()
  free_domains: number;
  @IsString()
  @IsNotEmpty()
  marketing_suite: string;
  @IsString()
  @IsNotEmpty()
  site_analytics: string;
  @IsString()
  @IsNotEmpty()
  ecommerce: string;
  @IsNotEmpty()
  @IsString()
  startDate: Date;
  @IsNotEmpty()
  @IsString()
  endDate: Date;
}
