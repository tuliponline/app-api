import { HttpStatus } from '@nestjs/common';

export class BaseResponse {
  statusCode: HttpStatus;
  message: string;
  data?: any;
  error?: any;
  meta?: Meta;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
