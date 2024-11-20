import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBankDto } from './create-bank.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BankStatus } from '../schemas/bank.schema';

export class UpdateBankDto extends PartialType(CreateBankDto) {
    @IsString()
    @ApiProperty()
    readonly name: string

    @IsString()
    @ApiProperty()
    readonly code: string

    @IsEnum(BankStatus)
    @IsString()
    @ApiProperty({ example: 'ACTIVE || INACTIVE' })
    readonly status: BankStatus

    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
    })
    logo: string | Express.Multer.File;
}
