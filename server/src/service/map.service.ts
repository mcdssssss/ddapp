import { Inject, Provide } from '@midwayjs/decorator';
import { CONFIG_MAPKEY } from '../constant';
import { MapKeyDTO } from '../dto/config.dto';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import AddressParse from 'address-parse';
@Provide()
export class MapService extends BaseService {
  @Inject()
  httpService: HttpService;

  @Inject()
  configService: ConfigService;

  /**
   * 地址解析
   * @param address 地址（注：地址中请包含城市名称，否则会影响解析效果）
   * @param region 地址所在城市（若地址中包含城市名称侧可不传）
   */
  async addressResolution(address: string, region?: string) {
    // 获取配置
    const config = (await this.configService.getConfig(
      CONFIG_MAPKEY
    )) as MapKeyDTO;
    const result = (await this.httpService.get(
      'https://apis.map.qq.com/ws/geocoder/v1/',
      {
        address,
        region,
        key: config.mapKey,
      }
    )) as { status?: number; message?: string; result?: any };
    if (result.status !== 0) {
      throw new DefaultError(result.message);
    }
    return result.result;
  }

  /**
   * 逆地址解析
   * @param latitude 纬度
   * @param longitude  经度
   */
  async inverseAddressResolution(latitude: number, longitude: number) {
    // 获取配置
    const config = (await this.configService.getConfig(
      CONFIG_MAPKEY
    )) as MapKeyDTO;
    const result = (await this.httpService.get(
      'https://apis.map.qq.com/ws/geocoder/v1/',
      {
        location: `${latitude},${longitude}`,
        key: config.mapKey,
      }
    )) as { status?: number; message?: string; result?: any };
    if (result.status !== 0) {
      throw new DefaultError(result.message);
    }
    return result.result;
  }

  /**
   * 批量坐标计算
   * @param from  起点坐标 格式： lat,lng;lat,lng…（经度与纬度用英文逗号分隔，坐标间用英文分号分隔）
   * @param to 终点坐标 格式： lat,lng;lat,lng…（经度与纬度用英文逗号分隔，坐标间用英文分号分隔）
   * @param mode  计算方式，取值： driving：驾车 walking：步行 bicycling：自行车
   */
  async batchDistanceCalculation(
    from: string,
    to: string,
    mode = 'bicycling' as 'driving' | 'walking' | 'bicycling'
  ) {
    // 获取配置
    const config = (await this.configService.getConfig(
      CONFIG_MAPKEY
    )) as MapKeyDTO;
    const result = (await this.httpService.get(
      'https://apis.map.qq.com/ws/distance/v1/matrix',
      {
        from,
        to,
        mode,
        key: config.mapKey,
      }
    )) as { status?: number; message?: string; result?: any };
    if (result.status !== 0) {
      throw new DefaultError(result.message);
    }
    return result.result;
  }

  /**
   * 坐标转换
   * @param locations 预转换的坐标，支持批量转换，格式：纬度前，经度后，纬度和经度之间用",“分隔，每组坐标之间使用”;"分隔
   * @param type 输入的locations的坐标类型 可选值为[1,6]之间的整数，每个数字代表的类型说明：
            1 GPS坐标
            2 sogou经纬度
            3 baidu经纬度
            4 mapbar经纬度
            5 [默认]腾讯、google、高德坐标
            6 sogou墨卡托
   * @returns
   */
  async coordinateTransformation(
    locations: string,
    type: 1 | 2 | 3 | 4 | 5 | 6
  ) {
    // 获取配置
    const config = (await this.configService.getConfig(
      CONFIG_MAPKEY
    )) as MapKeyDTO;
    const result = (await this.httpService.get(
      'https://apis.map.qq.com/ws/coord/v1/translate',
      {
        locations,
        type,
        key: config.mapKey,
      }
    )) as { status?: number; message?: string; locations?: any };
    if (result.status !== 0) {
      throw new DefaultError(result.message);
    }
    return result.locations;
  }

  /**
   * 经纬度地点搜索
   * @param keyword 搜索关键字，长度最大96个字节
   * @param boundary 搜索中心点的经纬度，格式顺序为纬度在前，经度在后 格式： boundary=nearby(lat,lng,radius[, auto_extend]) or boundary=region(city_name [,auto_extend][,lat,lng])
   */
  async locationSearch(
    keyword: string,
    boundary: string,
    current?: number,
    pageSize?: number
  ) {
    // 获取配置
    const config = (await this.configService.getConfig(
      CONFIG_MAPKEY
    )) as MapKeyDTO;
    const result = (await this.httpService.get(
      'https://apis.map.qq.com/ws/place/v1/search',
      {
        keyword,
        boundary,
        key: config.mapKey,
        page_size: pageSize || 10,
        page_index: current || 1,
      }
    )) as { status?: number; message?: string; data?: any };
    if (result.status !== 0) {
      throw new DefaultError(result.message);
    }
    return result.data;
  }

  /**
   * 智能识别地址
   * @param keyword
   * @returns
   */
  addressParse(keyword: string) {
    const [result] = AddressParse.parse(keyword);
    return result;
  }
}
