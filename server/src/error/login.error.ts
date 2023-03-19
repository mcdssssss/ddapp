import { MidwayHttpError } from '@midwayjs/core';

export class LoginError extends MidwayHttpError {
  constructor(message: string) {
    super(message, 203);
  }
}
