import { Catch } from '@midwayjs/decorator';
import { Context } from 'egg';
import { ResultResponse } from '../interface';
interface ErrorFilter extends Error {
  status?: number;
}
@Catch()
export class AllErrorFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async catch(err: ErrorFilter, _ctx: Context): Promise<ResultResponse> {
    const result = {
      code: err.status || 1001,
      msg: err.message,
      data: null,
    };
    switch (err.name) {
      case 'NotFoundError':
        result.code = 404;
        result.msg = '服务访问404';
        break;
      case 'InternalServerErrorError':
        result.code = 500;
        result.msg = '服务端错误500';
        break;
    }
    if (result.code === 1000) {
      console.error(
        '[ ServerError ]',
        _ctx.request.URL.pathname,
        new Date().toLocaleString(),
        result.msg
      );
    }
    if (result.code === 422) {
      console.error(
        '[ ValidateError ]',
        new Date().toLocaleString(),
        result.msg
      );
    }
    if (result.code === 1001) {
      console.error(err.stack);
    }

    if (result.code === 1004) {
      result.data = (err as any).cause.message;
    }
    return result;
  }
}
