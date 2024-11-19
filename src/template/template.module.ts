import { forwardRef, Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schemas/template.schema';
import { UserModule } from '../user/user.module';
import { TemplateDomainModule } from 'src/template-domain/template-domain.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => TemplateDomainModule),
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
