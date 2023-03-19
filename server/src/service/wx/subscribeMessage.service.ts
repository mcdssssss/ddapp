import { Inject, Provide } from '@midwayjs/decorator';
import { CONFIG_NOTICE } from '../../constant';
import { NoticeDTO } from '../../dto/config.dto';
import {
  WxGetpubtemplatetitlesDTO,
  WxSubscribeAddTemplateDTO,
  WxSubscribeSendDTO,
} from '../../dto/wx.dto';
import { DefaultError } from '../../error/default.error';
import { BaseService } from '../base.service';
import { ConfigService } from '../config.service';
import { HttpService } from '../http.service';
import { WxappService } from '../wxapp.service';
const dayjs = require('dayjs');

interface WxResult {
  errcode?: number;
  errmsg?: string;
  data?: any;
  count?: number;
}
@Provide()
export class WxSubscribeMessageService extends BaseService {
  @Inject()
  wxAppService: WxappService;

  @Inject()
  http: HttpService;

  @Inject()
  configService: ConfigService;

  /**
   * 组合模板并添加至帐号下的个人模板库
   * @param tid 模板标题 id，可通过接口获取，也可登录小程序后台查看获取
   * @param kidList 开发者自行组合好的模板关键词列表，关键词顺序可以自由搭配（例如 [3,5,4] 或 [4,5,3]），最多支持5个，最少2个关键词组合
   * @param sceneDesc 服务场景描述，15个字以内
   * @returns
   */
  async addTemplate(dto: WxSubscribeAddTemplateDTO) {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.post(
      'https://api.weixin.qq.com/wxaapi/newtmpl/addtemplate?access_token=' +
        token,
      dto
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result.data;
  }

  /**
   * 删除帐号下的个人模板
   * @param priTmplId 要删除的模板id
   * @returns
   */
  async deleteTemplate(priTmplId: string) {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.post(
      'https://api.weixin.qq.com/wxaapi/newtmpl/deltemplate?access_token=' +
        token,
      {
        priTmplId,
      }
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result.data;
  }

  /**
   * 获取小程序账号的类目
   * @returns
   */
  async getCategory() {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.get(
      'https://api.weixin.qq.com/wxaapi/newtmpl/getcategory',
      {
        access_token: token,
      }
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result.data;
  }

  /**
   * 获取模板标题下的关键词列表
   * @param tid 模板标题 id，可通过接口获取
   * @returns
   */
  async getPubTemplateKeyWordsById(tid: string) {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.get(
      'https://api.weixin.qq.com/wxaapi/newtmpl/getpubtemplatekeywords',
      {
        access_token: token,
        tid,
      }
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result.data;
  }

  /**
   * 获取帐号所属类目下的公共模板标题
   * @param ids 类目 id，多个用逗号隔开
   * @param start 用于分页，表示从 start 开始。从 0 开始计数。
   * @param end 用于分页，表示拉取 limit 条记录。最大为 30。
   * @returns
   */
  async getPubTemplateTitleList(dto: WxGetpubtemplatetitlesDTO) {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.get(
      'https://api.weixin.qq.com/wxaapi/newtmpl/getpubtemplatetitles',
      Object.assign(dto, {
        access_token: token,
      })
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return { data: result.data, count: result.count };
  }

  /**
   * 获取当前帐号下的个人模板列表
   * @returns
   */
  async getTemplateList() {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.get(
      'https://api.weixin.qq.com/wxaapi/newtmpl/gettemplate',
      {
        access_token: token,
      }
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result.data;
  }

  /**
   *
   * @param params.touser 接收者（用户）的 openid
   * @param params.template_id 所需下发的订阅模板id
   * @param params.page 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
   * @param params.data  模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }
   * @param params.miniprogram_state 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
   * @param params.lang 进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
   * @returns
   */
  async send(params: WxSubscribeSendDTO) {
    const token = await this.wxAppService.getAccessToken();
    const result = (await this.http.post(
      'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' +
        token,
      params
    )) as WxResult;
    if (result.errcode !== 0) {
      throw new DefaultError(result.errmsg);
    }
    return result.data;
  }

  /**
   * 审核状态改变通知
   * @param userNo
   * @param status
   * @param updateTime
   * @param refuseReason
   */
  async riderVerifyChangeNoticeSend(
    userNo: string,
    status: 0 | 1 | 2,
    updateTime: number,
    refuseReason?: string
  ) {
    const wxapp = await this.wxAppService.wxappEntity.findOne({
      where: { userNo },
    });
    const config = (await this.configService.getConfig(
      CONFIG_NOTICE,
      false
    )) as NoticeDTO;
    if (wxapp && config) {
      const data = {} as any;
      for (let i = 0; i < config.verifySendKeys.length; i++) {
        let value = '';
        switch (config.verifyKeys[i].key) {
          case 'status':
            if (status === 1) {
              value = '已通过';
            } else if (status === 2) {
              value = '审核未通过';
            }
            break;
          case 'updateTime':
            value = dayjs(updateTime).format('YYYY/MM/DD HH:mm:ss');
            break;
          case 'refuseReason':
            value = refuseReason;
            break;
        }
        data[config.verifySendKeys[i]] = {
          value,
        };
      }
    }
  }
}
