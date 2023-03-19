import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import {
  CONFIG_APPAUTH_INFO,
  CONFIG_APPMCH,
  WXAPP_ACCESSTOKEN,
} from '../constant';
import { AppauthUpsertDTO, AppMchDTO } from '../dto/config.dto';
import { WxappEntity } from '../entity/wxapp.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { WxService } from './wx.service';

@Provide()
export class WxappService extends BaseService {
  @InjectEntityModel(WxappEntity)
  wxappEntity: Repository<WxappEntity>;

  @Inject()
  http: HttpService;

  @Inject()
  configService: ConfigService;

  @Inject()
  wxService: WxService;

  async findByOpenid(openid: string) {
    return await this.wxappEntity.findOne({
      where: { openid },
    });
  }

  async findByNo(wxappNo: string) {
    return await this.wxappEntity.findOne({
      where: { wxappNo },
    });
  }

  /**
   * 获取微信小程序的用户手机号
   * @param code 手机号获取凭证
   * @returns
   */
  async getUserPhoneNumber(code: string) {
    const accessToken = await this.getAccessToken();
    const result = (await this.http.post(
      'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' +
        accessToken,
      {
        code,
      }
    )) as {
      errcode?: number;
      errmsg?: string;
      phone_info?: {
        phoneNumber: string;
        purePhoneNumber: string;
        countryCode: string;
      };
    };
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result;
  }

  async getAccessToken() {
    const accessToken = await this.redis.get(WXAPP_ACCESSTOKEN);
    if (accessToken) {
      return accessToken;
    }
    const config = (await this.configService.getConfig(
      CONFIG_APPAUTH_INFO
    )) as AppauthUpsertDTO;
    const result = (await this.http.get(
      'https://api.weixin.qq.com/cgi-bin/token',
      {
        grant_type: 'client_credential',
        appid: config.wxAppId,
        secret: config.wxAppSecret,
      }
    )) as { access_token?: string; errmsg?: string; expires_in?: number };
    if (!result.access_token) {
      throw new DefaultError(result.errmsg);
    }
    await this.redis.set(
      WXAPP_ACCESSTOKEN,
      result.access_token,
      'EX',
      result.expires_in
    );
    return result.access_token;
  }

  /**
   * 统一下单支付
   * @param orderNo
   * @param totalPrice
   * @param des
   * @returns
   */
  async payUnifiedorder(orderNo: string, totalPrice: number, des: string) {
    const wxapyBody = await this.wxService.wxpayBodyData(
      orderNo,
      this.ctx.userInfo.openid,
      totalPrice,
      des
    );
    const result = await this.http.post(
      'https://api.mch.weixin.qq.com/pay/unifiedorder',
      wxapyBody.bodyData
    );
    const json = ((await this.wxService.xml2JSON(result)) as { xml: any }).xml;
    if (json.return_code[0] === 'FAIL') {
      throw new DefaultError(json.return_msg[0]);
    }
    return json;
  }

  /**
   * 统一下单支付v3
   * @param orderNo
   * @param totalPrice
   * @param des
   * @returns
   */
  async payUnifiedorderv3(orderNo: string, totalPrice: number, des: string) {
    const { appAuto, appMch, payurl } = this.wxService.getVersionInfo();
    const appconfig = (await this.configService.getConfig(
      appAuto
    )) as AppauthUpsertDTO;

    const config = (await this.configService.getConfig(appMch)) as AppMchDTO;
    try {
      const result = await this.http.post(
        'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
        {
          appid: appconfig.wxAppId,
          mchid: config.wxMchId,
          description: des,
          out_trade_no: orderNo,
          notify_url: config.notifyUrl + payurl,
          amount: {
            // total: Math.floor(totalPrice * 100),
            total: 1,
            currency: 'CNY',
          },
          payer: {
            openid: this.ctx.userInfo.openid,
          },
        }
      );
      console.log('====>pay', result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async refund(
    orderNo: string,
    totalFee: number,
    refundFee: number,
    refund_desc: string
  ) {
    const { formData, outRefundNo } = await this.wxService.wxpayReund(
      orderNo,
      totalFee,
      refundFee,
      refund_desc
    );

    const config = (await this.configService.getConfig(
      CONFIG_APPMCH
    )) as AppMchDTO;
    const certDir = join(__dirname, '../', 'cert');
    if (!existsSync(certDir)) {
      mkdirSync(certDir);
    }
    //创建文件夹目录
    let dirPath = join(__dirname, '../', 'cert', 'school');
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath);
    }

    if (!existsSync(join(dirPath, 'apiclient_cert.p12'))) {
      await this.http.pipe(config.certP12, dirPath, 'apiclient_cert.p12');
    }

    if (!existsSync(join(dirPath, 'apiclient_cert.pem'))) {
      await this.http.pipe(config.certPem, dirPath, 'apiclient_cert.pem');
    }

    if (!existsSync(join(dirPath, 'apiclient_key.pem'))) {
      await this.http.pipe(config.certKey, dirPath, 'apiclient_key.pem');
    }

    const result = await this.http.request({
      url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
      method: 'POST',
      json: formData,
      agentOptions: {
        pfx: readFileSync(join(dirPath, 'apiclient_cert.p12')),
        passphrase: config.wxMchId,
      },
    });
    const json = ((await this.wxService.xml2JSON(result)) as { xml: any }).xml;
    if (json.return_code[0] === 'FAIL') {
      throw new DefaultError(json.return_msg[0]);
    }
    json.outRefundNo = outRefundNo;
    return json;
  }
}
