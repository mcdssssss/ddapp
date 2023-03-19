import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import {
  SchoolAreaAddDTO,
  SchoolAreaDelDTO,
  SchoolAreaStatusDTO,
  SchoolAreaUpdateDTO,
  SchoolBuildAddDTO,
  SchoolBuildDelDTO,
  SchoolBuildUpdateDTO,
} from '../../dto/school.dto';
import { SchoolAreaEntity } from '../../entity/schoolArea.entity';
import { SchoolBuildingEntity } from '../../entity/schoolBuilding.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

@Controller('/admin/school/area', { middleware: [AdminMiddleware] })
export class SchoolAreaController extends BaseController {
  @InjectEntityModel(SchoolAreaEntity)
  areaEntity: Repository<SchoolAreaEntity>;

  @InjectEntityModel(SchoolBuildingEntity)
  buildEntity: Repository<SchoolBuildingEntity>;

  @Inject()
  queryService: QueryService;

  @Post('/add')
  @Validate()
  async addArea(@Body() dto: SchoolAreaAddDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.areaEntity.insert(
      Object.assign(dto, {
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (!res.raw.insertId) {
      throw new DefaultError('添加区域失败');
    }
    return this.responseSuccess('添加区域成功');
  }

  @Put('/update')
  @Validate()
  async updateArea(@Body() dto: SchoolAreaUpdateDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.areaEntity.update(
      {
        id: dto.id,
      },
      Object.assign(dto, {
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (res.affected === 0) {
      throw new DefaultError('修改区域失败');
    }
    return this.responseSuccess('修改区域成功');
  }

  @Put('/status')
  @Validate()
  async statusArea(@Body() dto: SchoolAreaStatusDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.areaEntity.update(
      {
        id: dto.id,
      },
      {
        status: dto.status,
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('修改状态失败');
    }
    return this.responseSuccess('修改状态成功');
  }

  @Del('/del')
  @Validate()
  async delArea(@Body() dto: SchoolAreaDelDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.areaEntity.update(
      {
        id: dto.id,
      },

      {
        isDelete: true,
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('删除失败');
    }
    return this.responseSuccess('删除成功');
  }

  @Post('/build/add')
  @Validate()
  async addBuild(@Body() dto: SchoolBuildAddDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.buildEntity.insert(
      Object.assign(dto, {
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (!res.raw.insertId) {
      throw new DefaultError('添加楼栋失败');
    }
    return this.responseSuccess('添加楼栋成功');
  }

  @Put('/build/update')
  @Validate()
  async updateBuild(@Body() dto: SchoolBuildUpdateDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.buildEntity.update(
      {
        id: dto.id,
      },
      Object.assign(dto, {
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (res.affected === 0) {
      throw new DefaultError('修改楼栋失败');
    }
    return this.responseSuccess('修改楼栋成功');
  }

  @Del('/build/del')
  @Validate()
  async delBuild(@Body() dto: SchoolBuildDelDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const res = await this.buildEntity.update(
      {
        id: dto.id,
      },
      {
        isDelete: true,
        updatedFrom: 'admin',
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (res.affected === 0) {
      throw new DefaultError('删除失败');
    }
    return this.responseSuccess('删除成功');
  }

  @Get('/list')
  @Validate()
  async list() {
    const areas = await this.areaEntity.find({
      where: { isDelete: false },
    });
    const builds = await this.buildEntity.find({
      where: { isDelete: false },
    });

    for (const area of areas) {
      (area as any).children = [];
      for (const build of builds) {
        if (build.areaId === area.id) {
          (area as any).children.push(build);
        }
      }
    }

    return this.responseSuccess('ok', areas);
  }

  @Get('/all')
  @Validate()
  async all() {
    const areas = await this.areaEntity.find({
      where: { isDelete: false },
    });
    return this.responseSuccess('ok', areas);
  }

  @Get('/build/list')
  @Validate()
  async buildList(@Query('areaId') areaId: number) {
    const builds = await this.buildEntity.find({
      where: { isDelete: false, areaId },
    });
    return this.responseSuccess('ok', builds);
  }
}
