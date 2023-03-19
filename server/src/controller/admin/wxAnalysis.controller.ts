import { Body, Controller, Inject, Post } from '@midwayjs/decorator';
import { AnalysisDateDTO } from '../../dto/analysis.dto';
import { HttpService } from '../../service/http.service';
import { BaseController } from '../base.controller';
import { WxappService } from '../../service/wxapp.service';
import { Validate } from '@midwayjs/validate';

@Controller('/api/analysis/wx')
export class WxAnalysisController extends BaseController {
  @Inject()
  http: HttpService;

  @Inject()
  wxappService: WxappService;

  /**
   * 获取用户访问小程序日留存
   */
  @Post('/retain/daily')
  @Validate()
  async getDailyRetain(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappiddailyretaininfo?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户访问小程序周留存
   */
  @Post('/retain/weekly')
  @Validate()
  async getWeeklyRetain(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappidweeklyretaininfo?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户访问小程序月留存
   */
  @Post('/retain/monthly')
  @Validate()
  async getMonthlyRetain(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappidmonthlyretaininfo?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户访问小程序数据概况
   * @param dto
   * @returns
   */
  @Post('/summary/daily')
  @Validate()
  async getDailySummary(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappiddailysummarytrend?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户访问小程序数据日趋势
   * @param dto
   * @returns
   */
  @Post('/visit/trend/daily')
  @Validate()
  async getDailyVisitTrend(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappiddailyvisittrend?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户访问小程序数据月趋势(能查询到的最新数据为上一个自然月的数据)
   * @param dto
   * @returns
   */
  @Post('/visit/trend/monthly')
  @Validate()
  async getMonthlyVisitTrend(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappidmonthlyvisittrend?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户访问小程序数据周趋势
   * @param dto
   * @returns
   */
  @Post('/visit/trend/weekly')
  @Validate()
  async getWeeklyVisitTrend(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappidweeklyvisittrend?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取小程序新增或活跃用户的画像分布数据。时间范围支持昨天、最近7天、最近30天。其中，新增用户数为时间范围内首次访问小程序的去重用户数，活跃用户数为时间范围内访问过小程序的去重用户数。
   * @param dto
   */
  @Post('/user/portrait')
  @Validate()
  async getUserPortrait(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappiduserportrait?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 获取用户小程序访问分布数据
   * @param dto
   * @returns
   */
  @Post('/visit/distribution')
  @Validate()
  async getVisitDistribution(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappidvisitdistribution?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }

  /**
   * 访问页面。目前只提供按 page_visit_pv 排序的 top200。
   * @param dto
   * @returns
   */
  @Post('/visit/page')
  @Validate()
  async getVisitPage(@Body() dto: AnalysisDateDTO) {
    const token = await this.wxappService.getAccessToken();
    const result = this.http.post(
      'https://api.weixin.qq.com/datacube/getweanalysisappidvisitpage?access_token=' +
        token,
      dto
    );
    return this.responseSuccess('ok', result);
  }
}
