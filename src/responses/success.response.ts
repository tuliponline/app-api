import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';
export class SuccessResponse extends BaseResponse {
  constructor(data: any, message = 'Success') {
    super();
    this.statusCode = HttpStatus.OK;
    this.message = message;
    this.data = data;
  }
}
