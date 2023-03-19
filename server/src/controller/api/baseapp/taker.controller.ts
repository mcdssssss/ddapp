import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { TakerAddDTO } from '../../../dto/taker.dto';
import { AppMiddleware } from '../../../middleware/app.middleware';
import { TakerService } from '../../../service/taker.service';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/taker', { middleware: [AppMiddleware] })
export class BaseappTakerController extends BaseController {
  @Inject()
  takerService: TakerService;

  @Get('/canitaker')
  @Validate()
  async canITaker() {
    const taker = await this.takerService.takerEntity.findOne({
      where: {
        userNo: this.ctx.userInfo.userNo,
      },
    });
    if (taker && taker.status === 1) {
      return this.responseSuccess('ok', taker.takerNo);
    } else {
      return this.responseSuccess('ok', false);
    }
  }

  @Post('/register')
  @Validate()
  async register(@Body() dto: TakerAddDTO) {
    const taker = await this.takerService.takerEntity.findOne({
      where: {
        userNo: this.ctx.userInfo.userNo,
      },
    });

    if (!taker) {
      await this.takerService.add(this.ctx.userInfo.userNo, 0, dto);
      return this.responseSuccess('已提交审核');
    } else {
      await this.takerService.update(this.ctx.userInfo.userNo, 0, dto);
      return this.responseSuccess('已提交审核');
    }
  }

  @Get('/info')
  async info() {
    const taker = await this.takerService.takerEntity.findOne({
      where: {
        userNo: this.ctx.userInfo.userNo,
      },
    });
    return this.responseSuccess('ok', taker);
  }
}
