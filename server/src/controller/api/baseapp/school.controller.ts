import { Controller, Get, Inject } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { MapService } from '../../../service/map.service';
import { OrderService } from '../../../service/order.service';
import { QueryService } from '../../../service/query.service';
import { SchoolService } from '../../../service/school.service';
import { BaseController } from '../../base.controller';

@Controller('/api/baseapp/school')
export class BaseAppSchoolController extends BaseController {
  @Inject()
  mapService: MapService;

  @Inject()
  schoolService: SchoolService;

  @Inject()
  orderService: OrderService;

  @Inject()
  queryService: QueryService;

  @Get('/info')
  async getSchoolService() {
    const result = await this.schoolService.getSchoolInfo();
    if (!result.serviceData) {
      result.serviceData = {
        services: [],
        iconInWhere: 'fixBtn',
        sortStyle: 'sort-4',
      };
    }
    return this.responseSuccess('ok', result);
  }

  @Get('/address')
  @Validate()
  async getSchoolAddressBySchoolNo() {
    const areas = await this.schoolService.areaEntity.find({
      where: {
        isDelete: false,
        status: 1,
      },
    });
    const builds = await this.schoolService.buildEntity.find({
      where: { isDelete: false },
    });

    for (const area of areas) {
      (area as any).children = [];
      for (const build of builds) {
        if (build.areaId === area.id) {
          (area as any).children.push(build);
        }
      }
    }

    return this.responseSuccess('ok', areas);
  }

  @Get('/carousel/info')
  @Validate()
  async carouselInfo() {
    const result = await this.schoolService.carouselInfo();
    return this.responseSuccess('ok', result);
  }
}
