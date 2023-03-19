import { Controller, Get, Inject } from '@midwayjs/decorator';
import {
  CONFIG_PROTOCOL_SCHOOL,
  WXAPP_SUBSCRIBE_SCHOOL,
  CONFIG_TIME_REQUIREMENTS_SCHOOL,
} from '../../../constant';
import { ConfigService } from '../../../service/config.service';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/config')
export class BaseappConfigController extends BaseController {
  @Inject()
  configService: ConfigService;

  @Get('/protocol')
  async getConfig() {
    const result = await this.configService.getConfig(
      CONFIG_PROTOCOL_SCHOOL,
      false
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * @api {get} api/baseapp/config/subscribe 获取订阅消息配置
   * @apiGroup 小程序
   * @apiName config-subscribe
   * @apiUse AppHeaderCommon
   * @apiParam {String} [provider] 小程序平台类型 如：weixin alipay
   */
  @Get('/subscribe')
  async getSubscribe() {
    const result = await this.configService.getConfig(
      WXAPP_SUBSCRIBE_SCHOOL,
      false
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * @api {get} api/baseapp/config/time/requirement 获取时间配置
   * @apiGroup 小程序
   * @apiName config-time
   * @apiUse AppHeaderCommon
   *
   */
  @Get('/time/requirement')
  async timeRequirementGet() {
    const result = await this.configService.getConfig(
      CONFIG_TIME_REQUIREMENTS_SCHOOL,
      false
    );
    return this.responseSuccess('ok', result);
  }
}
