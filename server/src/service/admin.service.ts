import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { AdminEntity } from '../entity/admin.entity';
import { DefaultError } from '../error/default.error';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { ToolService } from './tool.service';
import { AdminInitDTO, AdminListDTO } from '../dto/admin.dto';
import { QueryService } from './query.service';

@Provide()
export class AdminService extends BaseService {
  @InjectEntityModel(AdminEntity)
  adminEntity: Repository<AdminEntity>;

  @Inject()
  toolService: ToolService;

  @Inject()
  queryService: QueryService;

  async findByNo(adminNo: string) {
    return await this.adminEntity.findOne({
      where: { adminNo },
    });
  }

  getAdminInfo() {
    const adminInfo = this.ctx.adminInfo as AdminEntity;
    return {
      adminNo: adminInfo.adminNo,
      mobileNumber: this.toolService.getUnshowMobile(adminInfo.mobileNumber),
      adminName: adminInfo.adminName,
      realName: adminInfo.realName,
      avatarUrl: adminInfo.avatarUrl,
      isSuper: adminInfo.superAdmin,
    };
  }

  async verifySvgCode(no: string, verifyCode: string) {
    // 获取验证码
    const verifyedValue = await this.redis.get(`admin-vc-${no}`);
    if (!verifyedValue) {
      throw new DefaultError('验证码已过期');
    }
    if (verifyCode.toLowerCase() !== verifyedValue.toLowerCase()) {
      throw new DefaultError('验证码错误');
    }
    await this.redis.del(`admin-vc-${no}`);
  }

  async getSvgCode() {
    const result = this.toolService.getSvgCaptcha();
    const nanoid = this.nanoid(16);
    await this.redis.set(`admin-vc-${nanoid}`, result.text, 'EX', 10 * 60);
    return { svg: result.data, no: nanoid };
  }

  // 是否有超级管理员
  async hasSuperAdmin() {
    return !!(await this.adminEntity.findOne({
      where: { superAdmin: true },
    }));
  }

  async addSuperAdmin(adminInitDTO: AdminInitDTO) {
    return await this.adminEntity.insert({
      adminNo: this.nanoid(16),
      adminName: adminInitDTO.adminName,
      adminPwd: this.toolService.setMD5(adminInitDTO.adminPwd),
      realName: adminInitDTO.realName,
      mobileNumber: adminInitDTO.mobileNumber,
      superAdmin: true,
      status: 1,
    });
  }

  async list(adminListDTO: AdminListDTO) {
    let wheres = '';

    if (adminListDTO.adminName)
      wheres += ` ${wheres ? 'and' : ''} adminName like "%${
        adminListDTO.adminName
      }%"`;

    if (adminListDTO.adminNo) {
      wheres += ` ${wheres ? 'and' : ''} adminNo = "${adminListDTO.adminNo}"`;
    }

    if (adminListDTO.mobileNumber) {
      wheres += ` ${wheres ? 'and' : ''} mobileNumber = "${
        adminListDTO.mobileNumber
      }"`;
    }

    if (adminListDTO.realName) {
      wheres += ` ${wheres ? 'and' : ''} realName like "%${
        adminListDTO.realName
      }%"`;
    }

    if (adminListDTO.status !== undefined) {
      wheres += ` ${wheres ? 'and' : ''} status = ${adminListDTO.status}`;
    }

    return await this.queryService.select(this.adminEntity, {
      tables: this.adminEntity.metadata.tableName,
      wheres,
      fields:
        'adminNo,adminName,mobileNumber,realName,status,createTime,updateTime,defaultPwd, updatedBy, isDemo',
      current: adminListDTO.current,
      pageSize: adminListDTO.pageSize,
    });
  }
}
