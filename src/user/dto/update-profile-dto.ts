import { IsString, IsNotEmpty, IsEnum, IsDate, IsMongoId, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsString()
  @ApiProperty({ example: 'wBkQJ@example.com' })
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false, 
  })
  avatar: string | Express.Multer.File;

  @IsPhoneNumber('TH')
  @ApiProperty()
  readonly phoneNumber: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({ example: '2000-12-30' })
  readonly birthDate: Date;

  @IsMongoId()
  @ApiProperty()
  readonly BankId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  readonly bankBranch: string;

  @IsString()
  @ApiProperty()
  readonly bankAccount: string;

  @IsString()
  @ApiProperty()
  readonly bankAccountNumber: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false, 
  })
  bankBookImage: string | Express.Multer.File;
}
