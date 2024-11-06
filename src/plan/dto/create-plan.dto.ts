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
  readonly discount: number;
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
  readonly salePage: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly duration: number;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isRecommended: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isActive: boolean;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;
}
