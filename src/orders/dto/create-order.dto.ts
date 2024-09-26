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
  total: number;
  status: string;
}
