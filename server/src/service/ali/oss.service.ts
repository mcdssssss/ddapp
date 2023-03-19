import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '../base.service';
import OSS = require('ali-oss');
import { ConfigService } from '../config.service';
import { CONFIG_ALI } from '../../constant';
import { AliDTO } from '../../dto/config.dto';
import { DefaultError } from '../../error/default.error';

@Provide()
export class OSSService extends BaseService {
  @Inject()
  configService: ConfigService;

  async put(file: File & { filename: string; data: string }, perfix?: string) {
    const config = (await this.configService.getConfig(CONFIG_ALI)) as AliDTO;
    const client = new OSS({
      // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: config.ossRegion,
      // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket。
      bucket: config.ossBucket,
    });
    try {
      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
      const split = file.filename.split('.');
      const suffix = split[split.length - 1];
      const name = `${perfix || ''}${this.nanoid(20)}.${suffix}`;
      const result = await client.put(name, file.data);
      let url = result.url;
      if (!result.url.includes('https')) {
        url = result.url.replace('http', 'https');
      }
      return url;
    } catch (e) {
      throw new DefaultError(e.message);
    }
  }
}
