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
  AddressAddDTO,
  AddressDelDTO,
  AddressListDTO,
  AddressUpdateDTO,
} from '../../../dto/address.dto';
import { UserSchoolAddressEntity } from '../../../entity/userSchoolAddress.entity';
import { DefaultError } from '../../../error/default.error';
import { AppMiddleware } from '../../../middleware/app.middleware';
import { QueryService } from '../../../service/query.service';
import { SchoolService } from '../../../service/school.service';
import { UserService } from '../../../service/user.service';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/address', { middleware: [AppMiddleware] })
export class BaseappAddressController extends BaseController {
  @InjectEntityModel(UserSchoolAddressEntity)
  usaEntity: Repository<UserSchoolAddressEntity>;

  @Inject()
  queryService: QueryService;

  @Inject()
  userService: UserService;

  @Inject()
  schoolService: SchoolService;

  @Post('/add')
  @Validate()
  async add(@Body() dto: AddressAddDTO) {
    const addressNo = this.nanoid(16);
    const isDefault = dto.isDefault;
    delete dto.isDefault;
    const result = await this.usaEntity.insert(
      Object.assign(dto, {
        userNo: this.ctx.userInfo.userNo,
        addressNo,
      })
    );
    if (!result.raw.insertId) {
      throw new DefaultError('添加失败');
    }
    const params = {} as { schoolAddress?: string; communityAddress?: string };
    params.schoolAddress = addressNo;
    if (isDefault) {
      await this.userService.userModel.update(
        {
          userNo: this.ctx.userInfo.userNo,
        },
        params
      );
    }
    return this.responseSuccess('添加成功');
  }

  @Put('/update')
  @Validate()
  async update(@Body() dto: AddressUpdateDTO) {
    const isDefault = dto.isDefault;
    delete dto.isDefault;
    const result = await this.usaEntity.update(
      {
        addressNo: dto.addressNo,
        userNo: this.ctx.userInfo.userNo,
      },
      dto
    );
    if (result.affected === 0) {
      throw new DefaultError('修改失败');
    }
    const params = {} as { schoolAddress?: string; communityAddress?: string };
    params.schoolAddress = dto.addressNo;

    if (isDefault) {
      await this.userService.userModel.update(
        {
          userNo: this.ctx.userInfo.userNo,
        },
        params
      );
    }
    return this.responseSuccess('修改成功');
  }

  @Del('/del')
  @Validate()
  async del(@Body() dto: AddressDelDTO) {
    const result = await this.usaEntity.update(
      {
        addressNo: dto.addressNo,
        userNo: this.ctx.userInfo.userNo,
      },
      {
        isDelete: true,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('删除失败');
    }
    return this.responseSuccess('删除成功');
  }

  @Get('/list')
  @Validate()
  async list(@Query() dto: AddressListDTO) {
    const wheres = `isDelete=0  and userNo='${this.ctx.userInfo.userNo}'`;
    let order = 'updateTime desc';
    let defaultAddressNo = '';
    if (dto.current === 1) {
      const user = await this.userService.getUserByMiddleware();
      if (user) {
        if (user.schoolAddress) {
          defaultAddressNo = user.schoolAddress;
          order = `field(addressNo, '${user.schoolAddress}', addressNo) asc, updateTime desc`;
        }
      }
    }
    const result = await this.queryService.select(this.usaEntity, {
      tables: 'users_school_address',
      wheres,
      order,
      current: dto.current,
      pageSize: dto.pageSize,
    });
    for (const item of result.data) {
      if (defaultAddressNo === item.addressNo) {
        item.isDefault = true;
      }
      if (item.schoolBuild) {
        item.schoolBuild = JSON.parse(item.schoolBuild);
      }
    }
    return this.responseSuccess('ok', result);
  }

  @Get('/info')
  @Validate()
  async info(@Query() dto: AddressDelDTO) {
    const res = await this.usaEntity.findOne({
      where: { addressNo: dto.addressNo },
    });
    let defaultAddressNo = '';
    const user = await this.userService.getUserByMiddleware();
    if (user && user.schoolAddress) {
      defaultAddressNo = user.schoolAddress;
    }

    if (defaultAddressNo === res.addressNo) {
      (res as any).isDefault = true;
    } else {
      (res as any).isDefault = false;
    }

    return this.responseSuccess('ok', res);
  }
}
