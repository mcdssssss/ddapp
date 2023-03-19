import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { CONFIG_APPAUTH_INFO } from '../../constant';
import { AppauthUpsertDTO } from '../../dto/config.dto';
import { WxappLoginDTO } from '../../dto/wxapp.dto';
import { WxappEntity } from '../../entity/wxapp.entity';
import { DefaultError } from '../../error/default.error';
import { LoginError } from '../../error/login.error';
import { ConfigService } from '../../service/config.service';
import { HttpService } from '../../service/http.service';
import { JWTService } from '../../service/jwt.service';
import { UserService } from '../../service/user.service';
import { WxappService } from '../../service/wxapp.service';
import { BaseController } from '../base.controller';

@Controller('/api/wxapp')
export class WxappController extends BaseController {
  @Inject()
  configService: ConfigService;

  @Inject()
  httpService: HttpService;

  @Inject()
  jwtService: JWTService;

  @Inject()
  userService: UserService;

  @InjectEntityModel(WxappEntity)
  wxappEntity: Repository<WxappEntity>;

  @Inject()
  wxappService: WxappService;

  @Get('/login')
  async login(@Query() loginDTO: WxappLoginDTO) {
    // 获取小程序配置
    const result = (await this.configService.getConfig(
      CONFIG_APPAUTH_INFO
    )) as AppauthUpsertDTO;
    if (!result.wxAppId || !result.wxAppSecret) {
      throw new DefaultError('暂无凭证信息配置');
    }
    const res = (await this.httpService.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        appid: result.wxAppId,
        secret: result.wxAppSecret,
        js_code: loginDTO.code,
        grant_type: 'authorization_code',
      }
    )) as {
      errcode?: number;
      errmsg?: string;
      openid?: string;
      session_key?: string;
    };
    if (res.errcode || !res.openid || !res.session_key) {
      throw new DefaultError(res.errmsg);
    }
    const findRes = await this.wxappService.findByOpenid(res.openid);
    if (!findRes) {
      const wxappNo = this.nanoid(32);
      await this.wxappEntity.insert({
        openid: res.openid,
        wxappNo,
      });
      return this.responseSuccess('ok', wxappNo);
    }
    if (findRes.userNo) {
      const user = await this.userService.findByNo(findRes.userNo);
      if (user) {
        return this.responseSuccess('ok', {
          wxappNo: findRes.wxappNo,
          user: this.userService.getUserInfo(user),
        });
      }
    }
    return this.responseSuccess('ok', { wxappNo: findRes.wxappNo });
  }

  @Get('/outlogin')
  async outlogin() {}

  @Post('/register')
  async register(@Body() loginDTO: WxappLoginDTO) {
    const wxappNo = this.ctx.request.header.wxappno as string;
    if (!wxappNo) {
      throw new LoginError('请重新登录');
    }
    const wxapp = await this.wxappService.findByNo(wxappNo);
    if (!wxapp) {
      throw new LoginError('用户不存在');
    }
    const result = await this.wxappService.getUserPhoneNumber(loginDTO.code);
    let user = await this.userService.findByMobile(
      result.phone_info.purePhoneNumber
    );
    if (!user) {
      await this.userService.add(
        result.phone_info.countryCode,
        result.phone_info.purePhoneNumber,
        loginDTO.fromNo
      );
      user = await this.userService.findByMobile(
        result.phone_info.purePhoneNumber
      );
    }

    await this.wxappEntity.update(
      {
        wxappNo,
      },
      {
        userNo: user.userNo,
      }
    );

    return this.responseSuccess('ok', this.userService.getUserInfo(user));
  }
}
