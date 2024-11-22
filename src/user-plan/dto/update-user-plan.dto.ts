import { PartialType } from '@nestjs/swagger';
import { CreateUserPlanDto } from './create-user-plan.dto';
import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class UpdateUserPlanDto extends PartialType(CreateUserPlanDto) {
    @IsString()
    orderNo: string;

    @IsMongoId()
    userId: string;

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    discount: number;

    @IsNumber()
    vat: number;

    @IsNumber()
    total: number;

    @IsNumber()
    storage: number;

    @IsNumber()
    pages: number;

    @IsNumber()
    salePage: number;

    @IsNumber()
    duration: number;

    @IsNumber()
    startDate: Date;

    @IsString()
    endDate: Date;

    @IsString()
    refNo: string;
}
