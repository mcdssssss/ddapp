import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  WxGetpubtemplatetitlesDTO,
  WxSubscribeAddTemplateDTO,
  WxSubscribeDelTemplateDTO,
  WxSubscribeSendDTO,
  WxSubscribeTmpKeyDTO,
} from '../../dto/wx.dto';
import { WxSubscribeMessageService } from '../../service/wx/subscribeMessage.service';
import { BaseController } from '../base.controller';

@Controller('/admin/wx/subscribe/message')
export class WxSubscribeMessageController extends BaseController {
  @Inject()
  wxSMService: WxSubscribeMessageService;

  @Post('/addtemplate')
  @Validate()
  async addTemplate(@Body() dto: WxSubscribeAddTemplateDTO) {
    const result = await this.wxSMService.addTemplate(dto);
    return this.responseSuccess('操作成功', result);
  }

  @Post('/deltemplate')
  @Validate()
  async deleteTemplate(@Body() dto: WxSubscribeDelTemplateDTO) {
    const result = await this.wxSMService.deleteTemplate(dto.priTmplId);
    return this.responseSuccess('操作成功', result);
  }

  @Get('/getcategory')
  async getCategory() {
    const result = await this.wxSMService.getCategory();
    return this.responseSuccess('ok', result);
  }

  @Get('/getpubtemplatekeywords')
  @Validate()
  async getPubTemplateKeyWordsById(@Query() dto: WxSubscribeTmpKeyDTO) {
    const result = await this.wxSMService.getPubTemplateKeyWordsById(dto.tid);
    return this.responseSuccess('ok', result);
  }

  @Get('/getpubtemplatetitles')
  @Validate()
  async getPubTemplateTitleList(@Query() dto: WxGetpubtemplatetitlesDTO) {
    const result = await this.wxSMService.getPubTemplateTitleList(dto);
    return this.responseSuccess('ok', result);
  }

  @Get('/gettemplate')
  async getTemplateList() {
    const result = await this.wxSMService.getTemplateList();
    return this.responseSuccess('ok', result);
  }

  @Post('/send')
  @Validate()
  async send(@Body() dto: WxSubscribeSendDTO) {
    const result = await this.wxSMService.send(dto);
    return this.responseSuccess('发送成功', result);
  }
}
