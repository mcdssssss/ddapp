import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { SCHOOL_INFO, SCHOOL_SERVICE_DATA } from '../constant';
import { SchoolAreaEntity } from '../entity/schoolArea.entity';
import { SchoolBuildingEntity } from '../entity/schoolBuilding.entity';
import { SchoolCarouselsEnitty } from '../entity/schoolCarousels.entity';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';

@Provide()
export class SchoolService extends BaseService {
  @InjectEntityModel(SchoolAreaEntity)
  areaEntity: Repository<SchoolAreaEntity>;

  @InjectEntityModel(SchoolBuildingEntity)
  buildEntity: Repository<SchoolBuildingEntity>;

  @InjectEntityModel(SchoolCarouselsEnitty)
  carouselEntity: Repository<SchoolCarouselsEnitty>;

  @Inject()
  configService: ConfigService;

  async carouselInfo() {
    const schoolCarousels = await this.redis.get('schoolCarousels');
    if (!schoolCarousels) {
      const result = await this.carouselEntity.findOne();
      if (result && result.banners) {
        await this.redis.set('schoolCarousels', JSON.stringify(result.banners));
        return result.banners;
      }
      return [];
    }
    return JSON.parse(schoolCarousels);
  }

  async clearCarouselRedis() {
    await this.redis.set('schoolCarousels', '');
  }

  async getSchoolInfo() {
    let params = {} as any;
    const info = await this.configService.getConfig(SCHOOL_INFO, false);
    const serviceData = await this.configService.getConfig(
      SCHOOL_SERVICE_DATA,
      false
    );
    if (info) {
      params = info;
    }
    if (serviceData) {
      params.serviceData = serviceData.serviceData;
    }
    return params;
  }
}
