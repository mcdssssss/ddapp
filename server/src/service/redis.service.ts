import { Inject, Provide } from '@midwayjs/decorator';
import { Context } from 'egg';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class RedisCustomService {
  @Inject()
  redis: RedisService;

  @Inject()
  ctx: Context;

  filterSassKey(key: any) {
    return key;
  }

  async set(
    key: any,
    value: string | number | Buffer,
    secondsToken?: 'EX',
    seconds?: number
  ) {
    key = this.filterSassKey(key);
    if (secondsToken) {
      return await this.redis.set(key, value, secondsToken, seconds);
    } else {
      return await this.redis.set(key, value);
    }
  }

  async get(key: any) {
    key = this.filterSassKey(key);
    return await this.redis.get(key);
  }

  async del(key: any) {
    key = this.filterSassKey(key);
    return await this.redis.del(key);
  }
}
