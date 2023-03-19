import { Inject, Provide } from '@midwayjs/decorator';
import { CONFIG_APPAUTH_INFO, CONFIG_APPMCH } from '../constant';
import { AppauthUpsertDTO, AppMchDTO } from '../dto/config.dto';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { createHash } from 'crypto';
import { parseString } from 'xml2js';
import { DefaultError } from '../error/default.error';
@Provide()
export class WxService extends BaseService {
  @Inject()
  configService: ConfigService;

  getVersionInfo() {
    const appAuto = CONFIG_APPAUTH_INFO;
    const appMch = CONFIG_APPMCH;
    const payurl = '/api/baseapp/order/pay/callback';
    const refundUrl = '/api/baseapp/order/refund/callback';
    return { appAuto, appMch, payurl, refundUrl };
  }

  /**
   * 微信支付体
   * @param orderNo
   * @param openid
   * @param totalFee
   * @param des 描述
   * @returns
   */
  async wxpayBodyData(
    orderNo: string,
    openid: string,
    totalFee: number,
    des: string
  ) {
    const { appAuto, appMch, payurl } = this.getVersionInfo();

    const appconfig = (await this.configService.getConfig(
      appAuto
    )) as AppauthUpsertDTO;

    const config = (await this.configService.getConfig(appMch)) as AppMchDTO;
    const nonceStr = this.getNonceStr();
    const notifyUrl = config.notifyUrl + payurl;
    const ip = this.ctx.ip;
    const totalPrice = Math.floor(totalFee * 100);
    let bodyData = '<xml>';
    bodyData += '<appid>' + appconfig.wxAppId + '</appid>'; // 小程序ID
    bodyData += '<body>' + des + '</body>'; // 商品描述
    bodyData += '<mch_id>' + config.wxMchId + '</mch_id>'; // 商户号
    bodyData += '<nonce_str>' + nonceStr + '</nonce_str>'; // 随机字符串
    bodyData += '<notify_url>' + notifyUrl + '</notify_url>'; // 支付成功的回调地址
    bodyData += '<openid>' + openid + '</openid>'; // 用户标识
    bodyData += '<out_trade_no>' + orderNo + '</out_trade_no>'; // 商户订单号
    bodyData += '<spbill_create_ip>' + ip + '</spbill_create_ip>'; // 终端IP
    bodyData += '<total_fee>' + totalPrice + '</total_fee>'; // 总金额 单位为分
    bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI
    // 签名
    const sign = this.paysignjsapi(
      appconfig.wxAppId,
      des,
      config.wxMchId,
      nonceStr,
      notifyUrl,
      openid,
      orderNo,
      ip,
      totalPrice,
      config.wxMchSecert
    );
    bodyData += '<sign>' + sign + '</sign>';
    bodyData += '</xml>';
    return { bodyData, sign, nonceStr, totalFee: totalPrice, notifyUrl };
  }

  /**
   * 微信退款
   * @param orderNo
   * @param totalFee
   * @param refundFee
   * @returns
   */
  async wxpayReund(
    orderNo: string,
    totalFee: number,
    refundFee: number,
    refundDesc = '无'
  ) {
    const { appAuto, appMch, refundUrl } = this.getVersionInfo();
    const appconfig = (await this.configService.getConfig(
      appAuto
    )) as AppauthUpsertDTO;
    const config = (await this.configService.getConfig(appMch)) as AppMchDTO;
    const outRefundNo = this.nanoid(32);
    const nonce_str = this.getNonceStr();
    const refundPrice = Math.floor(refundFee * 100);
    const totalPrice = Math.floor(totalFee * 100);
    const notifyUrl = config.notifyUrl + refundUrl;
    let formData = '<xml>';
    formData += '<appid>' + appconfig.wxAppId + '</appid>'; // 公众账号ID    appid
    formData += '<mch_id>' + config.wxMchId + '</mch_id>'; // 商户号    mch_id
    formData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
    formData += '<out_refund_no>' + outRefundNo + '</out_refund_no>'; // 商户退款单号
    formData += '<out_trade_no>' + orderNo + '</out_trade_no>'; //商户系统内部订单号
    formData += '<refund_fee>' + refundPrice + '</refund_fee>'; // 退款金额
    formData += '<total_fee>' + totalPrice + '</total_fee>'; // 订单金额
    formData += '<notify_url>' + notifyUrl + '</notify_url>'; // 退款通知
    formData += '<refund_desc>' + refundDesc + '</refund_desc>';
    formData +=
      '<sign>' +
      this.refundsign(
        appconfig.wxAppId,
        config.wxMchId,
        nonce_str,
        outRefundNo,
        orderNo,
        refundPrice,
        totalPrice,
        config.wxMchSecert,
        notifyUrl,
        refundDesc
      ) +
      '</sign>'; // 签名    sign
    formData += '</xml>';

    return { formData, outRefundNo };
  }

  //获取随机串
  getNonceStr(len?: number) {
    len = len || 32;
    const $chars =
      'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  paysign2(
    appId: string,
    timeStamp: string,
    nonceStr: string,
    pack: string,
    mch_secert: string
  ) {
    const ret = {
      appId,
      timeStamp,
      nonceStr,
      package: pack,
      signType: 'MD5',
    };
    let str = this.raw(ret);
    str = str + '&key=' + mch_secert;
    let md5Str = createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
  }

  // 生成签名
  paysignjsapi(
    appid,
    body,
    mch_id,
    nonce_str,
    notify_url,
    openid,
    out_trade_no,
    spbill_create_ip,
    total_fee,
    mch_secert
  ) {
    const ret = {
      appid: appid,
      body: body,
      mch_id: mch_id,
      nonce_str: nonce_str,
      notify_url: notify_url,
      openid: openid,
      out_trade_no: out_trade_no,
      spbill_create_ip: spbill_create_ip,
      total_fee: total_fee,
      trade_type: 'JSAPI',
    };
    let str = this.raw(ret);
    str = str + '&key=' + mch_secert;
    let md5Str = createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
  }

  refundsign(
    appid,
    mch_id,
    nonce_str,
    out_refund_no,
    out_trade_no,
    refund_fee,
    total_fee,
    key,
    notifyUrl,
    refundDesc
  ) {
    const ret = {
      appid: appid,
      mch_id: mch_id,
      nonce_str: nonce_str,
      out_refund_no: out_refund_no,
      out_trade_no: out_trade_no,
      refund_fee: refund_fee,
      total_fee: total_fee,
      notify_url: notifyUrl,
      refund_desc: refundDesc,
    };
    let string = this.raw(ret);
    string = string + '&key=' + key; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
    const sign = createHash('md5').update(string, 'utf8').digest('hex');
    return sign.toUpperCase();
  }

  raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort();
    const newArgs = {};
    keys.forEach((key: string) => {
      newArgs[key] = args[key];
    });

    let str = '';
    for (const k in newArgs) {
      str += '&' + k + '=' + newArgs[k];
    }
    str = str.substring(1);
    return str;
  }

  async xml2JSON(cbdata) {
    return new Promise((resolve: any) => {
      parseString(cbdata, (err, result) => {
        if (err) throw new DefaultError(err.message);
        resolve(result);
      });
    });
  }
}
