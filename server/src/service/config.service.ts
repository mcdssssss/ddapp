import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { QueryFailedError, Repository } from 'typeorm';
import { ConfigEntity } from '../entity/config.entity';
import { ConfigError } from '../error/config.error';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';

@Provide()
export class ConfigService extends BaseService {
  @InjectEntityModel(ConfigEntity)
  configEntity: Repository<ConfigEntity>;

  async upsert(configKey: string, configContext: any) {
    await this.configEntity
      .insert({
        configKey,
        configContext,
        updatedBy: this.ctx.adminInfo.adminNo,
      })
      .catch(async (err: QueryFailedError) => {
        if (err.driverError.errno === 1062) {
          await this.configEntity.update(
            {
              configKey,
            },
            {
              configContext,
              updatedBy: this.ctx.adminInfo.adminNo,
            }
          );
        } else {
          throw new DefaultError('更新配置失败');
        }
      });

    await this.redis.set('config-' + configKey, '');
  }

  /**
   * 获取配置
   * @param configKey
   * @param throwError 是否抛出异常
   * @returns
   */
  async getConfig(configKey: string, throwError = true) {
    const result = await this.redis.get('config-' + configKey);
    if (!result) {
      try {
        const findResult = await this.configEntity.findOne({
          where: { configKey },
        });
        if (!findResult) {
          if (throwError) {
            throw new ConfigError('暂无此项配置');
          } else {
            return false;
          }
        }
        await this.redis.set(
          'config-' + configKey,
          JSON.stringify(findResult.configContext)
        );
        return findResult.configContext;
      } catch (error) {
        return null;
      }
    }
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }
}
