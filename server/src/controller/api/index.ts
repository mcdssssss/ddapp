import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { BaseController } from '../base.controller';
import { MapService } from '../../service/map.service';
import { ConfigService } from '../../service/config.service';
import {
  CONFIG_AGREEMENT_RIDER,
  CONFIG_GUIDE_RIDER,
  CONFIG_GUIDE_USER,
  CONFIG_NOTICE,
  CONFIG_ORDER_FEE,
  CONFIG_SHARE,
  MINIAPP_CITY,
} from '../../constant';
import { AliSmsService } from '../../service/ali/sms.service';

@Controller('/api/home')
export class HomeController extends BaseController {
  @Inject()
  mapService: MapService;

  @Inject()
  configService: ConfigService;

  @Inject()
  smsService: AliSmsService;

  @Get('/text')
  async getText(@Query('type') type: 'user' | 'rider' | 'riderAgreement') {
    let key = '';
    switch (type) {
      case 'user':
        key = CONFIG_GUIDE_USER;
        break;
      case 'rider':
        key = CONFIG_GUIDE_RIDER;
        break;
      case 'riderAgreement':
        key = CONFIG_AGREEMENT_RIDER;
        break;
    }
    const res = await this.configService.getConfig(key);
    return this.responseSuccess('ok', res);
  }

  @Get('/config')
  async getConfig() {
    const notice = await this.configService.getConfig(CONFIG_NOTICE, false);
    const share = await this.configService.getConfig(CONFIG_SHARE, false);
    const fee = await this.configService.getConfig(CONFIG_ORDER_FEE, false);
    const miniapp = await this.configService.getConfig(MINIAPP_CITY, false);
    return this.responseSuccess('ok', {
      notice,
      share,
      fee,
      miniapp,
    });
  }
}
