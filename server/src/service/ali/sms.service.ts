import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '../base.service';
import { ConfigService } from '../config.service';
import { CONFIG_ALI } from '../../constant';
import { AliDTO } from '../../dto/config.dto';
import { DefaultError } from '../../error/default.error';
const Core = require('@alicloud/pop-core');
@Provide()
export class AliSmsService extends BaseService {
  @Inject()
  configService: ConfigService;

  async sendSmsVerifyCode(phoneNumber: string, code: string) {
    const ali = (await this.configService.getConfig(CONFIG_ALI)) as AliDTO;
    const client = new Core({
      accessKeyId: ali.accessKeyId,
      accessKeySecret: ali.accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25',
    });
    const params = {
      PhoneNumbers: phoneNumber,
      SignName: ali.smsSignName,
      TemplateCode: ali.smsTemplateCode,
      TemplateParam: JSON.stringify({
        code,
      }),
    };

    return new Promise(resolve => {
      client
        .request('SendSms', params, { method: 'POST', formatParams: false })
        .then(
          result => {
            resolve(result);
            console.log('短信验证码:', JSON.stringify(result));
          },
          ex => {
            resolve(ex);
            console.log(ex);
          }
        );
    });
  }

  getAppNo() {
    const wxappNo = this.ctx.request.header.wxappno as string;
    const aliappNo = this.ctx.request.header.aliappno as string;
    const qqappNo = this.ctx.request.header.qqappno as string;
    return wxappNo || aliappNo || qqappNo;
  }

  /**
   * 发送了几次短信
   */
  async getSendVerifyCodeCount() {
    const result = await this.redis.get('sms-vc-count-' + this.getAppNo());
    const data = {
      startTime: 0,
      count: 0,
    };
    if (result) {
      const json = JSON.parse(result);
      data.count++;
      data.startTime = json.startTime;
    }
    return data;
  }

  /**
   * 记录一次发送短信次数
   */
  async addSendVerifyCodeCount() {
    const result = await this.redis.get('sms-vc-count-' + this.getAppNo());
    const data = {
      startTime: 0,
      count: 0,
    };
    if (!result) {
      data.startTime = Date.now();
      data.count = 1;
    } else {
      const json = JSON.parse(result);
      data.count++;
      data.startTime = json.startTime;
    }
    await this.redis.set(
      'sms-vc-count-' + this.getAppNo(),
      JSON.stringify(data),
      'EX',
      600
    );
  }

  /**
   * 记录发送短信内容
   */
  async setSendVerifyRecord(code: string, phoneNumber: string) {
    // 10分钟到期
    await this.redis.set(
      'sms-vc-record-' + this.getAppNo(),
      JSON.stringify({
        code,
        phoneNumber,
      }),
      'EX',
      600
    );
  }

  /**
   * 验证短信内容
   */
  async doVerifyCode(code: string, phoneNumber: string) {
    const result = await this.redis.get('sms-vc-record-' + this.getAppNo());
    if (!result) {
      throw new DefaultError('短信验证码已过期');
    }
    const json = JSON.parse(result);
    if (code !== json.code || phoneNumber !== json.phoneNumber) {
      throw new DefaultError('验证码不正确');
    }
  }
}
