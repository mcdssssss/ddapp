import { Inject, Provide } from '@midwayjs/decorator';
import { CONFIG_ALI } from '../../constant';
import { AliDTO } from '../../dto/config.dto';
import { NoticeError } from '../../error/notice.error';
import { BaseService } from '../base.service';
import { ConfigService } from '../config.service';
const StsClient = require('@alicloud/sts-sdk');
/**
 * 使用STS临时访问凭证访问OSS 教程
 * https://help.aliyun.com/document_detail/100624.htm?spm=a2c4g.11186623.0.0.75565b78xKNESY#concept-xzh-nzk-2gb
 */
@Provide()
export class STSService extends BaseService {
  @Inject()
  configService: ConfigService;

  async getTempToken(userNo: string) {
    const config = (await this.configService.getConfig(CONFIG_ALI)) as AliDTO;
    const sts = new StsClient({
      endpoint: 'sts.aliyuncs.com',
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
    });
    const res = await sts.assumeRole(config.arn, userNo);
    if (!res.Credentials) {
      throw new NoticeError('sts认证失败', res.Message);
    }
    return Object.assign(res.Credentials, {
      oss: {
        region: config.ossRegion,
        bucket: config.ossBucket,
      },
    });
  }
}
