import { MidwayHttpError } from '@midwayjs/core';

export class NoticeError extends MidwayHttpError {
  constructor(message: string, desc: string) {
    super(message, 1004, '1004', {
      cause: new Error(desc),
    });
  }
}
