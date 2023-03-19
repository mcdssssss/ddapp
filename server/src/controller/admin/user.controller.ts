import { Body, Controller, Get, Inject, Put, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { UserListDTO, UserStatusDTO } from '../../dto/user.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { QueryService } from '../../service/query.service';
import { UserService } from '../../service/user.service';
import { BaseController } from '../base.controller';

@Controller('admin/user', { middleware: [AdminMiddleware] })
export class UsersController extends BaseController {
  @Inject()
  userService: UserService;

  @Inject()
  queryService: QueryService;

  @Get('/list')
  @Validate()
  async list(@Query() dto: UserListDTO) {
    if (this.ctx.adminInfo.isDemo) {
      throw new DefaultError('演示账户无权查看用户信息');
    }
    let where = '';
    if (dto.mobileNumber) {
      where += `mobileNumber like "%${dto.mobileNumber}%"`;
    }
    if (dto.nickName) {
      where += ` ${where ? ' and ' : ''} nickName like "%${dto.nickName}%"`;
    }
    if (dto.userNo) {
      where += ` ${where ? ' and ' : ''} userNo = "${dto.userNo}"`;
    }
    const result = await this.queryService.select2(this.userService.userModel, {
      wheres: where,
      order: 'DESC',
      current: dto.current,
      pageSize: dto.pageSize,
    });

    return this.responseSuccess('ok', result);
  }

  @Put('/status')
  @Validate()
  async status(@Body() dto: UserStatusDTO) {
    const result = await this.userService.userModel.update(
      {
        userNo: dto.userNo,
      },
      {
        status: dto.status,
      }
    );
    if (result.affected === 0) {
      throw new DefaultError('更改状态失败');
    }
    return this.responseSuccess('更新状态成功');
  }
}
