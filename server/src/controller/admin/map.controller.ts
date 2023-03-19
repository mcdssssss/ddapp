import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { MapSearchDTO } from '../../dto/map.dto';
import { MapService } from '../../service/map.service';
import { BaseController } from '../base.controller';

@Controller('/admin/map')
export class AdminMapController extends BaseController {
  @Inject()
  mapSerivce: MapService;

  @Get('/location/search')
  @Validate()
  async locationSearch(@Query() searchDTO: MapSearchDTO) {
    const result = await this.mapSerivce.locationSearch(
      searchDTO.keyword,
      `region(${searchDTO.cityName})`,
      searchDTO.current,
      searchDTO.pageSize
    );
    return this.responseSuccess('ok', result);
  }
}
