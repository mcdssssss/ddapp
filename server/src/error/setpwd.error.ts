import { MidwayHttpError } from '@midwayjs/core';

export class SetpwdError extends MidwayHttpError {
  constructor(message: string) {
    super(message, 202);
  }
}
