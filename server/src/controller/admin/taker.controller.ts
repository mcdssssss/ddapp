import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  AdminTakerAddDTO,
  AdminTakerListDTO,
  AdminTakerPassDTO,
  AdminTakerRefuseDTO,
} from '../../dto/taker.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { SchoolService } from '../../service/school.service';
import { SubscribeService } from '../../service/subscribeService';
import { TakerService } from '../../service/taker.service';
import { UserService } from '../../service/user.service';
import { BaseController } from '../base.controller';

@Controller('/admin/taker', { middleware: [AdminMiddleware] })
export class AdminTakerController extends BaseController {
  @Inject()
  takerService: TakerService;

  @Inject()
  queryService: QueryService;

  @Inject()
  userService: UserService;

  @Inject()
  subscribeService: SubscribeService;

  @Inject()
  schoolService: SchoolService;

  @Post('/add')
  @Validate()
  async add(@Body() dto: AdminTakerAddDTO) {
    await this.takerService.add(dto.userNo, 1, dto);
    return this.responseSuccess('添加成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: AdminTakerListDTO) {
    let wheres = 'ur.userNo=tk.userNo ';
    if (dto.idCard) {
      wheres += ` and tk.idCard = '${dto.idCard}'`;
    }
    if (dto.realName) {
      wheres += ` and tk.realName like '%${dto.realName}%'`;
    }
    if (dto.userNo) {
      wheres += ` and tk.userNo = '${dto.userNo}'`;
    }
    if (dto.takerNo) {
      wheres += ` and tk.takerNo = '${dto.takerNo}'`;
    }

    if (dto.status !== undefined) {
      wheres += ` and tk.status = ${dto.status}`;
    }
    const result = await this.queryService.select(
      this.takerService.takerEntity,
      {
        wheres,
        tables: `${this.takerService.getTableName()} tk,${this.userService.getTableName()} ur`,
        current: dto.current,
        pageSize: dto.pageSize,
        fields: 'tk.*,ur.mobileNumber',
        order: 'tk.updateTime desc',
      }
    );
    for (const item of result.data) {
      item.cardImages = JSON.parse(item.cardImages);
    }
    return this.responseSuccess('ok', result);
  }

  @Put('/pass')
  @Validate()
  async pass(@Body() dto: AdminTakerPassDTO) {
    const result = await this.takerService.takerEntity.update(
      {
        takerNo: dto.takerNo,
      },
      {
        status: 1,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('通过失败');
    }
    const taker = await this.takerService.takerEntity.findOne({
      where: { takerNo: dto.takerNo },
    });
    this.subscribeService.sendSubscribeByRegisterTaker(taker);

    return this.responseSuccess('通过成功');
  }

  @Put('/refuse')
  @Validate()
  async refuse(@Body() dto: AdminTakerRefuseDTO) {
    const result = await this.takerService.takerEntity.update(
      {
        takerNo: dto.takerNo,
      },
      {
        status: -1,
        refuseMsg: dto.refuseMsg,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('拒绝失败');
    }
    const taker = await this.takerService.takerEntity.findOne({
      where: { takerNo: dto.takerNo },
    });
    this.subscribeService.sendSubscribeByRegisterTaker(taker);
    return this.responseSuccess('拒绝成功');
  }

  @Get('/mobile')
  async findByMobile(@Query('mobileNumber') mobileNumber: string) {
    const user = await this.userService.findByMobile(mobileNumber);
    if (!user) {
      throw new DefaultError('不存在该用户');
    }
    const taker = await this.takerService.takerEntity.findOne({
      where: {
        userNo: user.userNo,
      },
    });
    if (!taker) {
      throw new DefaultError('该用户未通过接单审核');
    }
    if (taker.status === 0) {
      throw new DefaultError('接单员已被禁用');
    }
    return this.responseSuccess(
      'ok',
      Object.assign(this.userService.getUserInfo(user), {
        realName: taker.realName,
        takerNo: taker.takerNo,
      })
    );
  }
}
