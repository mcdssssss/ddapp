import { IMiddleware, NextFunction } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { Context } from 'egg';
import { DefaultError } from '../error/default.error';
import { LoginError } from '../error/login.error';
import { JWTService } from '../service/jwt.service';
import { UserService } from '../service/user.service';

@Middleware()
export class UserMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const jwtService = await ctx.requestContext.getAsync(JWTService);
      const userService = await ctx.requestContext.getAsync(UserService);
      const token = ctx.cookies.get('token');
      if (!token) {
        throw new LoginError('请重新登录');
      }
      const verifyResult = await jwtService.verify(token);
      if (verifyResult.isExpried) {
        // 过期
        throw new LoginError('回话过期，请重新登录');
      }
      if (!verifyResult.userId) {
        console.log('------用户校验失败------', verifyResult);
        throw new DefaultError('用户校验失败');
      }
      if (verifyResult.ip !== ctx.ip) {
        throw new LoginError('您已被强制下线');
      }
      const userInfo = await userService.findById(verifyResult.userId);
      if (!userInfo) {
        throw new DefaultError('获取用户失败');
      }
      if (!userInfo.id) {
        throw new DefaultError('用户不存在');
      }
      if (userInfo.status === 0) {
        throw new DefaultError('您的账户已被限制');
      }
      ctx.userInfo = userInfo;
      return await next();
    };
  }
}
