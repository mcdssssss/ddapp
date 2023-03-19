import { Controller, Get, Query } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Validate } from '@midwayjs/validate';
import { Repository } from 'typeorm';
import { RichtextInfoDTO } from '../../../dto/richtext.dto';
import { RichtextEntity } from '../../../entity/richtext.entity';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/richtext')
export class BaseappRichtextController extends BaseController {
  @InjectEntityModel(RichtextEntity)
  richtextEntity: Repository<RichtextEntity>;

  @Get('/info')
  @Validate()
  async info(@Query() dto: RichtextInfoDTO) {
    const result = await this.richtextEntity.findOne({
      where: { richNo: dto.richNo },
    });
    return this.responseSuccess('ok', result);
  }
}
