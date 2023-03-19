import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import {
  InsertResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { JWTService } from './jwt.service';
import { createHash } from 'crypto';

@Provide()
export class UserService extends BaseService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Inject()
  jwtService: JWTService;

  getTableName() {
    return this.userModel.metadata.tableName;
  }

  getUserInfo(user?: UserEntity) {
    const userInfo = user || (this.ctx.userInfo as UserEntity);
    return {
      userNo: userInfo.userNo,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      countryCode: userInfo.countryCode,
      mobileNumber: this.getUnshowMobile(userInfo.mobileNumber),
      province: userInfo.province,
      city: userInfo.city,
      area: userInfo.area,
      gender: userInfo.gender,
    };
  }

  getUnshowMobile(mobileNumber?: string) {
    const mobile = mobileNumber || this.ctx.userInfo.mobileNumber;
    const split = mobile.split('');
    const str =
      split[0] + split[1] + split[2] + '******' + split[9] + split[10];
    return str;
  }

  getUnshowName(name: string) {
    const split = name.split('');
    let str = split[0];
    for (let i = 1; i < split.length; i++) {
      str += '*';
    }
    return str;
  }

  async findByOpenid(wxOpenid: string) {
    return await this.userModel.findOne({
      where: {
        wxOpenid,
      },
    });
  }

  async getUserByMiddleware() {
    return this.findByNo(this.ctx.userInfo.userNo);
  }

  async findByNo(userNo: string) {
    return await this.userModel.findOne({
      where: { userNo },
    });
  }

  async findById(id: number) {
    return await this.userModel.findOne({ where: { id } });
  }

  async findByMobile(mobileNumber: string) {
    return await this.userModel.findOne({
      where: { mobileNumber },
    });
  }

  // 检测短信验证码
  async verifyVerifyCode(verifyCode: string) {
    if (verifyCode !== '123123') {
      throw new DefaultError('验证码错误');
    }
  }

  async updateMobile(mobileNumber: string, userNo: string) {
    await this.userModel
      .update(
        {
          userNo,
        },
        {
          mobileNumber,
          updateTime: Date.now(),
        }
      )
      .catch((err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          throw new DefaultError('手机号已被注册');
        }
        throw new DefaultError(err.name);
      })
      .then((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new DefaultError('修改手机号失败');
        }
      });
  }

  getPwd(pwd: string) {
    return createHash('md5').update(pwd).digest('hex');
  }

  async add(countryCode: string, mobileNumber: string, fromNo?: string) {
    const userNo = this.nanoid(16);

    return new Promise((resolve: any) => {
      this.userModel
        .insert({
          countryCode,
          mobileNumber,
          userNo,
          nickName: this.nanoid(8),
          fromNo,
        })
        .catch((err: QueryFailedError) => {
          if (err.driverError.errno === 1062) {
            throw new DefaultError('手机号已存在');
          } else {
            throw new DefaultError(err.message);
          }
        })
        .then(async (result: InsertResult) => {
          resolve(result);
        });
    });
  }
}
