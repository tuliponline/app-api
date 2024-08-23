import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';
import { Meta } from './base.response';
export class SuccessResponseWithMeta extends BaseResponse {
  constructor(data: any, message = 'Success', meta: Meta) {
    super();
    this.statusCode = HttpStatus.OK;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
