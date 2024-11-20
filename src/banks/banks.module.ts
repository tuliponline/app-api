import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from './schemas/bank.schema';
import { UploadImageModule } from 'src/upload-image/upload-image.module';

@Module({
  imports: [
    UploadImageModule,
    MongooseModule.forFeature([
      { name: Bank.name, schema: BankSchema },
    ])
  ],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
