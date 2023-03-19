import { IMiddleware, NextFunction } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { Context } from 'egg';
import { LoginError } from '../error/login.error';
import { AdminService } from '../service/admin.service';
import { JWTService } from '../service/jwt.service';
import { DefaultError } from '../error/default.error';
import { SetpwdError } from '../error/setpwd.error';

@Middleware()
export class AdminMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const adminService = await ctx.requestContext.getAsync(AdminService);
      const jwtService = await ctx.requestContext.getAsync(JWTService);
      const token = ctx.cookies.get('token');
      if (!token) {
        throw new LoginError('请重新登录');
      }
      const verifyResult = (await jwtService.verify(token)) as {
        isExpried: boolean;
        adminNo: string;
        ip: string;
      };
      if (verifyResult.isExpried) {
        // 过期
        throw new LoginError('回话过期，请重新登录');
      }
      if (!verifyResult.adminNo) {
        throw new DefaultError('校验失败');
      }
      if (verifyResult.ip !== ctx.ip) {
        throw new LoginError('您已被强制下线');
      }
      const adminInfo = await adminService.findByNo(verifyResult.adminNo);
      if (!adminInfo) {
        throw new LoginError('获取用户失败');
      }
      if (!adminInfo.id) {
        throw new LoginError('管理员不存在');
      }
      if (adminInfo.status === 0 && !adminInfo.superAdmin) {
        throw new LoginError('您的账户已被限制');
      }
      if (
        !adminInfo.adminPwd &&
        ctx.path !== '/admin/setpwd' &&
        ctx.path !== '/admin/info'
      ) {
        throw new SetpwdError('请先设置密码');
      }
      ctx.adminInfo = adminInfo;
      return await next();
    };
  }
}
