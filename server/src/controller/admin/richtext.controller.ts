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
import { FileMoveToGroupDTO } from '../../dto/file.dto';
import {
  RichtextAddDTO,
  RichtextDelDTO,
  RichtextInfoDTO,
  RichtextListDTO,
  RichtextUpdateDTO,
} from '../../dto/richtext.dto';
import { RichtextEntity } from '../../entity/richtext.entity';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { BaseController } from '../base.controller';

@Controller('/admin/richtext', { middleware: [AdminMiddleware] })
export class AdminRichtextController extends BaseController {
  @InjectEntityModel(RichtextEntity)
  richtextEntity: Repository<RichtextEntity>;

  @Inject()
  queryService: QueryService;

  @Post('/add')
  @Validate()
  async add(@Body() dto: RichtextAddDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.richtextEntity.insert(
      Object.assign(dto, {
        richNo: this.nanoid(16),
        updatedBy: this.ctx.adminInfo.adminNo,
      })
    );
    return this.returnInsert(result, '添加富文本');
  }

  @Put('/update')
  @Validate()
  async update(@Body() dto: RichtextUpdateDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.richtextEntity.update(
      {
        richNo: dto.richNo,
      },
      Object.assign(dto, { updatedBy: this.ctx.adminInfo.adminNo })
    );

    return this.returnUpdate(result);
  }

  @Del('/del')
  @Validate()
  async del(@Body() dto: RichtextDelDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权限操作');
    }
    const result = await this.richtextEntity
      .createQueryBuilder()
      .update()
      .set({ updatedBy: this.ctx.adminInfo.adminNo, isDelete: true })
      .where(`id in (${dto.ids})`)
      .execute();

    return this.returnDel(result);
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: RichtextListDTO) {
    let wheres = 'isDelete=0 ';
    if (dto.richTitle) {
      wheres += ` and richTitle like '%${dto.richTitle}%'`;
    }
    if (dto.groupId === -1) {
      wheres += ' and groupId = 0';
    } else if (dto.groupId > 0) {
      wheres += ` and groupId = ${dto.groupId}`;
    }
    const result = await this.queryService.select(this.richtextEntity, {
      tables: this.richtextEntity.metadata.tableName,
      current: dto.current,
      pageSize: dto.pageSize,
      wheres,
      fields: 'richNo,id,richTitle,richImage,groupId',
      order: 'updateTime desc',
    });
    return this.responseSuccess('ok', result);
  }

  @Get('/info')
  @Validate()
  async info(@Query() dto: RichtextInfoDTO) {
    const result = await this.richtextEntity.findOne({
      where: { richNo: dto.richNo },
    });
    return this.responseSuccess('ok', result);
  }

  @Put('/group/move')
  @Validate()
  async groupMove(@Body() dto: FileMoveToGroupDTO) {
    const result = await this.richtextEntity
      .createQueryBuilder()
      .update()
      .set({
        groupId: dto.groupId,
        updatedBy: this.ctx.adminInfo.adminNo,
      })
      .where(`id in (${dto.ids})`)
      .execute();
    if (result.affected === 0) {
      throw new DefaultError('移动失败');
    }
    return this.responseSuccess('成功移动了' + result.affected + '条数据');
  }
}
