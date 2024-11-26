import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { DomainStatus } from '../schemas/template-domain.schema';
import { Transform , Expose} from 'class-transformer';

export class ResponseTemplateDomainDto {
  @Expose()
  _id: Types.ObjectId;

  @Expose()
  domainName: string;

  @Expose()
  status: DomainStatus;

  @Expose()
  templateApp: string;

  @Expose({ name: 'template' })
  @Transform(({ obj }) => obj.templateId)
  template: any;

  @Expose()
  updateBy?: Types.ObjectId;

  @Expose()
  isEnable?: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}