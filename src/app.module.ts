import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { TemplateModule } from './template/template.module';
import { UserPlanModule } from './user-plan/user-plan.module';
import { OrdersModule } from './orders/orders.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { TemplateDomainModule } from './template-domain/template-domain.module';
import { BanksModule } from './banks/banks.module';

@Module({
  imports: [
    // เพิ่มไว้สำหรับการอ่าน config ผ่าน .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // จะอ่านจาก dotenv หรือ fix code ก็ได้ (สำหรับตัวอย่างนี้)
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigModule available
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        user: configService.get<string>('MONGODB_USER'),
        pass: configService.get<string>('MONGODB_PASS'),
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService], // Inject ConfigService to use it in useFactory
    }),
    AuthModule,
    UserModule,
    PlanModule,
    TemplateModule,
    UserPlanModule,
    OrdersModule,
    UploadImageModule,
    TemplateDomainModule,
    BanksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
