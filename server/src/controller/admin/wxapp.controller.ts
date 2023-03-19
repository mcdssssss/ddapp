import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { WxappListDTO } from '../../dto/wxapp.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { ConfigService } from '../../service/config.service';
import { QueryService } from '../../service/query.service';
import { WxappService } from '../../service/wxapp.service';
import { BaseController } from '../base.controller';

@Controller('/admin/wxapp', { middleware: [AdminMiddleware] })
export class AdminWxappController extends BaseController {
  @Inject()
  wxappService: WxappService;

  @Inject()
  queryService: QueryService;

  @Inject()
  configService: ConfigService;

  @Get('/list')
  @Validate()
  async list(@Query() dto: WxappListDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权查看用户信息');
    }
    let wheres = '';
    if (dto.userNo) {
      wheres += `${wheres ? ' and ' : ''} userNo = '${dto.userNo}'`;
    }

    if (dto.openid) {
      wheres += `${wheres ? ' and ' : ''} openid = '${dto.openid}'`;
    }
    const result = await this.queryService.select(
      this.wxappService.wxappEntity,
      {
        tables: this.wxappService.wxappEntity.metadata.tableName,
        wheres,
        current: dto.current,
        pageSize: dto.pageSize,
        order: 'createTime desc',
      }
    );
    return this.responseSuccess('ok', result);
  }
}
