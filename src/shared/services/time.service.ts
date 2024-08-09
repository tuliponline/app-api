import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  getNowInTST(): Date {
    const now = new Date();
    const utcOffsetInMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    return new Date(now.getTime() + utcOffsetInMilliseconds);
  }
}
