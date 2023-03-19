import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import {
  AddressParseDTO,
  MapLocationDTO,
  MapSearchDTO,
} from '../../dto/map.dto';
import { MapService } from '../../service/map.service';
import { BaseController } from '../base.controller';

@Controller('/api/map')
export class MapController extends BaseController {
  @Inject()
  mapSerivce: MapService;

  @Get('/location')
  @Validate()
  async getAddress(@Query() mapDTO: MapLocationDTO) {
    const result = await this.mapSerivce.inverseAddressResolution(
      mapDTO.latitude,
      mapDTO.longitude
    );
    return this.responseSuccess(
      'ok',
      Object.assign(result.address_component, mapDTO)
    );
  }

  @Post('/address/parse')
  @Validate()
  async search(@Body() dto: AddressParseDTO) {
    const result = this.mapSerivce.addressParse(dto.keyword);
    if (result.city || result.area) {
      const mapResult = await this.mapSerivce.addressResolution(
        result.province + result.city + result.area + result.details,
        result.city || undefined
      );
      return this.responseSuccess('ok', Object.assign(result, mapResult));
    }
    return this.responseSuccess('ok', result);
  }

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
