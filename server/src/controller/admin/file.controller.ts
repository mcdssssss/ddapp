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
  FileAddDTO,
  FileDelDTO,
  FileGroupAddDTO,
  FileGroupDelDTO,
  FileGroupUpdateDTO,
  FileListDTO,
  FileMoveToGroupDTO,
} from '../../dto/file.dto';
import { FileGroupEntity } from '../../entity/fileGroup.entity';
import { FilesEntity } from '../../entity/files.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

@Controller('/admin/file', { middleware: [AdminMiddleware] })
export class AdminFileController extends BaseController {
  @InjectEntityModel(FilesEntity)
  fileEntity: Repository<FilesEntity>;

  @InjectEntityModel(FileGroupEntity)
  groupEntity: Repository<FileGroupEntity>;

  @Inject()
  queryService: QueryService;

  @Post('/add')
  @Validate()
  async add(@Body() dto: FileAddDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.fileEntity.insert(
      Object.assign(dto, {
        updatedBy: this.ctx.adminInfo.adminNo,
        updatedFrom: 'admin',
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加失败');
    }
    return this.responseSuccess('添加成功');
  }

  @Del('/del')
  @Validate()
  async del(@Body() dto: FileDelDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.fileEntity
      .createQueryBuilder()
      .update()
      .set({
        isDelete: true,
        updatedBy: this.ctx.adminInfo.adminNo,
      })
      .where(`id in (${dto.ids}) `)
      .execute();
    if (result.affected === 0) {
      throw new DefaultError('删除失败');
    }
    return this.responseSuccess('成功删除' + result.affected + '条数据');
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: FileListDTO) {
    let wheres = 'isDelete = 0 ';
    if (dto.groupId === -1) {
      wheres += ` and groupId = 0`;
    } else if (dto.groupId > 0) {
      wheres += ` and groupId = ${dto.groupId}`;
    }
    const result = await this.queryService.select(this.fileEntity, {
      tables: this.fileEntity.metadata.tableName,
      current: dto.current,
      pageSize: dto.pageSize,
      wheres,
      order: 'createTime desc',
    });
    return this.responseSuccess('ok', result);
  }

  @Post('/group/add')
  @Validate()
  async groupAdd(@Body() dto: FileGroupAddDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.groupEntity.insert(
      Object.assign(dto, {
        updatedBy: this.ctx.adminInfo.adminNo,
        updatedFrom: 'admin',
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加失败');
    }
    return this.responseSuccess('添加成功');
  }

  @Put('/group/update')
  @Validate()
  async groupUpdate(@Body() dto: FileGroupUpdateDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.groupEntity.update(
      {
        id: dto.id,
      },
      Object.assign(dto, {
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    if (result.affected === 0) {
      throw new DefaultError('修改失败');
    }
    return this.responseSuccess('修改成功');
  }

  @Del('/group/del')
  @Validate()
  async groupDel(@Body() dto: FileGroupDelDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.groupEntity.update(
      {
        id: dto.id,
      },
      {
        isDelete: true,
        updatedBy: this.ctx.adminInfo.adminNo,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('删除失败');
    }
    return this.responseSuccess('删除成功');
  }

  @Get('/group/list')
  @Validate()
  async groupList(@Query('groupType') groupType: 'file' | 'richtext') {
    const result = await this.groupEntity.find({
      where: {
        isDelete: false,
        groupType,
        updatedFrom: 'admin',
      },
    });
    return this.responseSuccess('ok', result);
  }

  @Put('/group/move')
  @Validate()
  async groupMove(@Body() dto: FileMoveToGroupDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.fileEntity
      .createQueryBuilder()
      .update()
      .set({
        groupId: dto.groupId,
        updatedBy: this.ctx.adminInfo.adminNo,
      })
      .where(`id in (${dto.ids}) `)
      .execute();
    if (result.affected === 0) {
      throw new DefaultError('移动失败');
    }
    return this.responseSuccess('成功移动了' + result.affected + '条数据');
  }
}
