import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserPlanDto {
  @IsString()
  @IsNotEmpty()
  orderNo: string;
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
  discount: number;
  @IsNumber()
  @IsNotEmpty()
  vat: number;
  @IsNumber()
  @IsNotEmpty()
  total: number;
  @IsNumber()
  @IsNotEmpty()
  storage: number;
  @IsNumber()
  @IsNotEmpty()
  pages: number;
  @IsNumber()
  @IsNotEmpty()
  salePage: number;
  @IsNumber()
  @IsNotEmpty()
  duration: number;
  @IsNumber()
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  @IsString()
  endDate: Date;
  @IsString()
  refNo: string;
}
