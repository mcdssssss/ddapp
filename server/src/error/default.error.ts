import { MidwayHttpError } from '@midwayjs/core';

export class DefaultError extends MidwayHttpError {
  constructor(message: string) {
    super(message, 1000);
  }
}
