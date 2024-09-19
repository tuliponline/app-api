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
}
