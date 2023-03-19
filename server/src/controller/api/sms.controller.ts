import { Body, Controller, Inject, Post } from '@midwayjs/decorator';
import { BaseController } from '../base.controller';
import { MobileNumberDTO } from '../../dto/user.dto';
import { AliSmsService } from '../../service/ali/sms.service';
import { DefaultError } from '../../error/default.error';

@Controller('/api/sms')
export class SmsController extends BaseController {
  @Inject()
  smsService: AliSmsService;
  @Post('/code')
  async getSmsCode(@Body() dto: MobileNumberDTO) {
    const { count } = await this.smsService.getSendVerifyCodeCount();
    if (count >= 3) {
      throw new DefaultError('您的操作过于频繁，请稍后再试');
    }
    const code = (Math.random() + '').split('.')[1].substring(0, 6);
    await this.smsService.sendSmsVerifyCode(dto.mobileNumber, code);
    await this.smsService.setSendVerifyRecord(code, dto.mobileNumber);
    await this.smsService.addSendVerifyCodeCount();
    return this.responseSuccess('ok', '短信发送成功');
  }
}
