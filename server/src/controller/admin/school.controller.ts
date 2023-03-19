import { Body, Controller, Get, Inject, Post, Put } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { SCHOOL_INFO, SCHOOL_SERVICE_DATA } from '../../constant';
import {
  SchoolAddDTO,
  SchoolCarouselUpsertDTO,
  SchoolUpdateServiceDTO,
} from '../../dto/school.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { SchoolService } from '../../service/school.service';
import { BaseController } from '../base.controller';

@Controller('/admin/school', { middleware: [AdminMiddleware] })
export class AdminSchoolController extends BaseController {
  @Inject()
  schoolService: SchoolService;

  @Inject()
  queryService: QueryService;

  @Post('/update')
  @Validate()
  async add(@Body() dto: SchoolAddDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    await this.schoolService.configService.upsert(SCHOOL_INFO, dto);

    return this.responseSuccess('修改成功');
  }

  @Put('/update/service')
  @Validate()
  async updateService(@Body() dto: SchoolUpdateServiceDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    for (const item of dto.serviceData.services) {
      if (!item.nanoid) {
        item.nanoid = this.nanoid(20);
      }
    }
    await this.schoolService.configService.upsert(SCHOOL_SERVICE_DATA, dto);
    return this.responseSuccess('修改服务成功');
  }

  @Get('/info')
  async info() {
    return this.responseSuccess('ok', await this.schoolService.getSchoolInfo());
  }

  @Post('/carousel/upsert')
  @Validate()
  async carouselUpsert(@Body() dto: SchoolCarouselUpsertDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const find = await this.schoolService.carouselEntity.findOne();
    if (find) {
      const result = await this.schoolService.carouselEntity.update(
        {
          id: find.id,
        },
        Object.assign(dto, {
          updatedFrom: 'admin',
          updatedBy: this.ctx.adminInfo.adminNo,
        })
      );
      if (result.affected === 0) {
        throw new DefaultError('更新失败');
      }
      await this.schoolService.clearCarouselRedis();
      return this.responseSuccess('更新成功');
    } else {
      const result = await this.schoolService.carouselEntity.insert(
        Object.assign(dto, {
          updatedFrom: 'admin',
          updatedBy: this.ctx.adminInfo.adminNo,
          carouselNo: this.nanoid(16),
        })
      );
      if (!result.raw.insertId) {
        throw new DefaultError('保存失败');
      }
      await this.schoolService.clearCarouselRedis();
      return this.responseSuccess('保存成功');
    }
  }

  @Get('/carousel/info')
  @Validate()
  async carouselInfo() {
    const result = await this.schoolService.carouselInfo();
    return this.responseSuccess('ok', result);
  }
}
