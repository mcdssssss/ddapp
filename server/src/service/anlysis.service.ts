import { Inject, Provide } from '@midwayjs/decorator';
import {
  CONFIG_ALI,
  CONFIG_APPAUTH_INFO,
  CONFIG_APPMCH,
  CONFIG_MAPKEY,
  CONFIG_NOTICE,
} from '../constant';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';

@Provide()
export class AnlysisService extends BaseService {
  @Inject()
  configService: ConfigService;

  // 小程序配置
  async getAppAuthRateInfo() {
    return this.fitlerInfoResult(CONFIG_APPAUTH_INFO);
  }

  // 支付信息配置
  async getAppMchRateInfo() {
    return this.fitlerInfoResult(CONFIG_APPMCH);
  }

  // 订阅消息配置
  async getSubscribeInfo() {
    return this.fitlerInfoResult(CONFIG_NOTICE);
  }

  // 地图配置
  async getMap() {
    return this.fitlerInfoResult(CONFIG_MAPKEY);
  }

  // 阿里云配置
  async getAli() {
    return this.fitlerInfoResult(CONFIG_ALI);
  }

  async fitlerInfoResult(configApp: string) {
    const configAppMch = await this.configService.getConfig(configApp, false);
    let complete = 0;
    let keyLen = 0;
    if (configAppMch) {
      const keys = Object.keys(configAppMch);
      keyLen = keys.length;
      for (const key of keys) {
        if (configAppMch[key]) {
          complete++;
        }
      }
    }
    return {
      complete,
      keyLen,
      rate: keyLen > 0 ? this.filterNumber((complete * 100) / keyLen) : 0,
    };
  }
}
