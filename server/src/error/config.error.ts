import { MidwayHttpError } from '@midwayjs/core';

export class ConfigError extends MidwayHttpError {
  constructor(message: string) {
    super(message, 1003);
  }
}
