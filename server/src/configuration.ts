/**
 * @apiDefine TestUrl
 * @apiSampleRequest http://api.test.malimawai.cn/
 */

/**
 * @apiDefine AppHeaderCommon
 * @apiHeader {String} wxappno 微信平台用户识别编号
 * @apiHeader {String} token token
 * @apiHeader {String} version-name 版本 school or city or community
 */

import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, Inject } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as egg from '@midwayjs/web';
import * as redis from '@midwayjs/redis';
import * as validate from '@midwayjs/validate';
import { AllErrorFilter } from './filter/all.filter';
import * as orm from '@midwayjs/orm';
import * as upload from '@midwayjs/upload';
import * as task from '@midwayjs/task';
import * as ws from '@midwayjs/ws';
import * as bull from '@midwayjs/bull';
// import { EverythingSubscriber } from './entity/subscriber';

@Configuration({
  imports: [egg, redis, validate, orm, upload, task, ws, bull],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Inject()
  bullFramework: bull.Framework;

  async onReady() {
    this.app.useFilter([AllErrorFilter as any]);
    // await container.getAsync(EverythingSubscriber);
    // 创建队列自动执行一次
    const testQueue = this.bullFramework.createQueue('orderRobotAutoStart');
    // 立即执行这个任务
    await testQueue?.runJob({});
  }
}
