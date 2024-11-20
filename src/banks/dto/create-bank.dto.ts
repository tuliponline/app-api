import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BankStatus } from "../schemas/bank.schema";

export class CreateBankDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly name: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly code: string

    @IsEnum(BankStatus)
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
