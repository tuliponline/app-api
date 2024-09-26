import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'planId' })
  planId: string;
  userId: string;
  refno: string;
  customeremail: string;
  productdetail: string;
  price: number;
  discount: number;
  vat: number;
  total: number;
  status: string;
}
