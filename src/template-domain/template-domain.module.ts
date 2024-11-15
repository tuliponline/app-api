import { Module } from '@nestjs/common';
import { TemplateDomainService } from './template-domain.service';
import { TemplateDomainController } from './template-domain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateDomain, TemplateDomainSchema } from './schemas/template-domain.schema';
import { TemplateModule } from 'src/template/template.module';

@Module({
  imports: [
    TemplateModule,
    MongooseModule.forFeature([
      { name: TemplateDomain.name, schema: TemplateDomainSchema },
    ]),
  ],
  controllers: [TemplateDomainController],
  providers: [TemplateDomainService],
})
export class TemplateDomainModule {}
