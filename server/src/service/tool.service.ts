import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from './base.service';
import { createHash } from 'crypto';
import { JWTService } from './jwt.service';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
const svgCaptcha = require('svg-captcha');

@Provide()
export class ToolService extends BaseService {
  @Inject()
  jwtService: JWTService;

  setMD5(pwd: string) {
    return createHash('md5').update(pwd).digest('hex');
  }

  async setCookie(data: any, tokenName = 'token') {
    const token = this.jwtService.sign(data);
    this.ctx.cookies.set(tokenName, token, {
      httpOnly: false,
    });
    return token;
  }

  /**
   * 获取svg验证码
   */
  getSvgCaptcha() {
    const captcha = svgCaptcha.create();
    return captcha as { data: string; text: string };
  }

  /**
   * 手机号加****
   * @param mobileNumber
   * @returns
   */
  getUnshowMobile(mobileNumber: string) {
    const mobile = mobileNumber;
    const split = mobile.split('');
    const str =
      split[0] +
      split[1] +
      split[2] +
      '****' +
      split[7] +
      split[8] +
      split[9] +
      split[10];
    return str;
  }

  randomRangeNumber(minNumber: number, maxNumber: number) {
    const range = maxNumber - minNumber; //取值范围的差

    const random = Math.random(); //小于1的随机数

    return (minNumber + Math.round(random * range)).toString(); //最小数与随机数和取值范围求和，返回想要的随机数字
  }

  readDir(zip, nowPath: string) {
    const files = readdirSync(nowPath);
    files.forEach((fileName: string) => {
      const filePath = join(nowPath, fileName);
      const file = statSync(filePath);

      if (file.isDirectory()) {
        const dirList = zip.folder(fileName);
        this.readDir(dirList, filePath);
      } else {
        zip.file(fileName, readFileSync(filePath));
      }
    });
  }

  async saveZip(zip, saveFileName: string, saveDir: string) {
    const content = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });

    if (!existsSync(saveDir)) {
      mkdirSync(saveDir);
    }

    writeFileSync(join(saveDir, saveFileName), content, 'utf-8');
  }
}
