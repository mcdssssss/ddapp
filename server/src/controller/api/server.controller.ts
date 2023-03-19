import { Controller, Get, Inject } from '@midwayjs/decorator';
import { Context } from 'egg';
import { UserMiddleware } from '../../middleware/user.middleware';
import { STSService } from '../../service/ali/sts.service';
import { BaseController } from '../base.controller';

@Controller('/api/server')
export class ServerController extends BaseController {
  @Inject()
  stsService: STSService;

  @Inject()
  ctx: Context;

  // 获取身份信息
  @Get('/sts', { middleware: [UserMiddleware] })
  async getCallerIdentity() {
    const res = await this.stsService.getTempToken(this.ctx.userInfo.userNo);
    return this.responseSuccess('ok', res);
  }
}
