import { Controller, Get, Inject } from '@midwayjs/decorator';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { STSService } from '../../service/ali/sts.service';
import { BaseController } from '../base.controller';

@Controller('/admin/sts', { middleware: [AdminMiddleware] })
export class STSController extends BaseController {
  @Inject()
  stsService: STSService;

  @Get('/')
  async getSTS() {
    return this.responseSuccess(
      'ok',
      await this.stsService.getTempToken(this.ctx.adminInfo.adminNo)
    );
  }
}
