import { MidwayHttpError } from '@midwayjs/core';

export class TakerError extends MidwayHttpError {
  constructor(message: string) {
    super(message, 1002);
  }
}
