import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateStartQuestDto {
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ME or CUSTOMER' })
  for: string;
}
