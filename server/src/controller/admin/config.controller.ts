import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import {
  CONFIG_ALI,
  CONFIG_APPAUTH_INFO,
  CONFIG_COUPON,
  CONFIG_MAPKEY,
  CONFIG_APPMCH,
  CONFIG_NOTICE,
  CONFIG_ORDER_CANCEL,
  CONFIG_ORDER_FEE,
  CONFIG_ORDER_RECEIVE,
  CONFIG_GUIDE_USER,
  CONFIG_GUIDE_RIDER,
  CONFIG_CASH,
  CONFIG_SHARE,
  CONFIG_AGREEMENT_RIDER,
  CONFIG_PROTOCOL_SCHOOL,
  WXAPP_SUBSCRIBE_SCHOOL,
  SYSTEM_SETTING,
  MINIAPP_SCHOOL,
  CONFIG_ORDERTYPE_SCHOOL,
  CONFIG_SETTING_CASH_SCHOOL,
  CONFIG_TIME_REQUIREMENTS_SCHOOL,
} from '../../constant';
import {
  AliDTO,
  AppauthUpsertDTO,
  AppMchDTO,
  ConfigAdminSettingDTO,
  ConfigCancelOrderDTO,
  ConfigCashDTO,
  ConfigCashSettingDTO,
  ConfigGuideDTO,
  ConfigOrderFeeDTO,
  ConfigOrderReceiveDTO,
  ConfigProtocolDTO,
  ConfigShareDTO,
  ConfigSubscribeDTO,
  ConifgSetOrderTypeDTO,
  CouponSetDTO,
  MapKeyDTO,
  NoticeDTO,
  TimeRequirementDTO,
} from '../../dto/config.dto';
import { DefaultError } from '../../error/default.error';
import { AdminMiddleware } from '../../middleware/admin.middleware';
import { ConfigService } from '../../service/config.service';
import { BaseController } from '../base.controller';

@Controller('/admin/config', { middleware: [AdminMiddleware] })
export class ConfigController extends BaseController {
  @Inject()
  configService: ConfigService;

  checkIsSuperAdmin() {
    if (!this.ctx.adminInfo.superAdmin) {
      throw new DefaultError('无权限');
    }
  }

  @Post('/appauth')
  @Validate()
  async appUpsert(@Body() upDTO: AppauthUpsertDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_APPAUTH_INFO, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/appauth')
  async appGetInfo() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_APPAUTH_INFO);
    return this.responseSuccess('ok', result);
  }

  @Post('/map')
  @Validate()
  async mapUpsert(@Body() upDTO: MapKeyDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_MAPKEY, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/map')
  async mapGetInfo() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_MAPKEY);
    return this.responseSuccess('ok', result);
  }

  @Post('/ali')
  @Validate()
  async aliUpsert(@Body() upDTO: AliDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_ALI, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/ali')
  async aliInfoGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_ALI);
    return this.responseSuccess('ok', result);
  }

  @Post('/coupon')
  @Validate()
  async couponUpsert(@Body() upDTO: CouponSetDTO) {
    this.checkIsSuperAdmin();

    await this.configService.upsert(CONFIG_COUPON, upDTO);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/coupon')
  async couponGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_COUPON);
    return this.responseSuccess('ok', result);
  }

  @Post('/appmch')
  @Validate()
  async mchUpsert(@Body() upDTO: AppMchDTO) {
    this.checkIsSuperAdmin();

    await this.configService.upsert(CONFIG_APPMCH, upDTO);

    const dirPath = join(__dirname, '../', '../', 'cert');
    if (existsSync(dirPath)) {
      if (existsSync(join(dirPath, 'apiclient_cert.p12'))) {
        unlinkSync(join(dirPath, 'apiclient_cert.p12'));
      }
      if (existsSync(join(dirPath, 'apiclient_cert.pem'))) {
        unlinkSync(join(dirPath, 'apiclient_cert.pem'));
      }
      if (existsSync(join(dirPath, 'apiclient_key.pem'))) {
        unlinkSync(join(dirPath, 'apiclient_key.pem'));
      }
    }

    return this.responseSuccess('更新配置成功');
  }

  @Get('/appmch')
  async mchGetInfo() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_APPMCH);
    return this.responseSuccess('ok', result);
  }

  @Post('/notice')
  @Validate()
  async noticeSet(@Body() dto: NoticeDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_NOTICE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/notice')
  async noticeGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_NOTICE);
    return this.responseSuccess('ok', result);
  }

  @Post('/ordercancel')
  @Validate()
  async orderCancel(@Body() dto: ConfigCancelOrderDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_ORDER_CANCEL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/ordercancel')
  async getOrderCancel() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_ORDER_CANCEL);
    return this.responseSuccess('ok', result);
  }

  @Post('/orderfee')
  @Validate()
  async orderFee(@Body() dto: ConfigOrderFeeDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_ORDER_FEE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/orderfee')
  async getOrderFee() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_ORDER_FEE);
    return this.responseSuccess('ok', result);
  }

  @Post('/orderreceive')
  @Validate()
  async orderReceive(@Body() dto: ConfigOrderReceiveDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_ORDER_RECEIVE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/orderreceive')
  async getOrderReceive() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_ORDER_RECEIVE);
    return this.responseSuccess('ok', result);
  }

  @Post('/guide/user')
  @Validate()
  async userGuidePost(@Body() dto: ConfigGuideDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_GUIDE_USER, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/guide/user')
  async userGuideGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_GUIDE_USER);
    return this.responseSuccess('ok', result);
  }

  @Post('/guide/rider')
  @Validate()
  async riderGuidePost(@Body() dto: ConfigGuideDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_GUIDE_RIDER, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/guide/rider')
  async riderGuideGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_GUIDE_RIDER);
    return this.responseSuccess('ok', result);
  }

  @Post('/agreement/rider')
  @Validate()
  async riderAgreementPost(@Body() dto: ConfigGuideDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_AGREEMENT_RIDER, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/agreement/rider')
  async riderAgreementGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_AGREEMENT_RIDER);
    return this.responseSuccess('ok', result);
  }

  @Post('/cash')
  @Validate()
  async cashPost(@Body() dto: ConfigCashDTO) {
    this.checkIsSuperAdmin();

    await this.configService.upsert(CONFIG_CASH, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/cash')
  async cashGet() {
    this.checkIsSuperAdmin();

    const result = await this.configService.getConfig(CONFIG_CASH);
    return this.responseSuccess('ok', result);
  }

  @Post('/share')
  @Validate()
  async sharePost(@Body() dto: ConfigShareDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_SHARE, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/share')
  async shareGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_SHARE);
    return this.responseSuccess('ok', result);
  }

  @Post('/protocol')
  @Validate()
  async protocolPost(@Body() dto: ConfigProtocolDTO) {
    this.checkIsSuperAdmin();

    await this.configService.upsert(CONFIG_PROTOCOL_SCHOOL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/protocol')
  async protocolGet() {
    this.checkIsSuperAdmin();

    const result = await this.configService.getConfig(CONFIG_PROTOCOL_SCHOOL);
    return this.responseSuccess('ok', result);
  }

  @Post('/subscribe/wx')
  @Validate()
  async subscribeWxPost(@Body() dto: ConfigSubscribeDTO) {
    this.checkIsSuperAdmin();

    await this.configService.upsert(WXAPP_SUBSCRIBE_SCHOOL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/subscribe/wx')
  async subscribeWxGet() {
    this.checkIsSuperAdmin();

    const result = await this.configService.getConfig(WXAPP_SUBSCRIBE_SCHOOL);
    return this.responseSuccess('ok', result);
  }

  @Post('/setting')
  @Validate()
  async setting(@Body() dto: ConfigAdminSettingDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(SYSTEM_SETTING, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/setting')
  @Validate()
  async settingGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(SYSTEM_SETTING);
    return this.responseSuccess('ok', result);
  }

  @Get('/miniapp')
  async miniappGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(MINIAPP_SCHOOL);
    return this.responseSuccess('ok', result);
  }

  @Post('/ordertype')
  @Validate()
  async ordertype(@Body() dto: ConifgSetOrderTypeDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_ORDERTYPE_SCHOOL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/ordertype')
  async ordertypeGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(CONFIG_ORDERTYPE_SCHOOL);
    return this.responseSuccess('ok', result);
  }

  @Post('/cash/setting')
  @Validate()
  async cashsettingPost(@Body() dto: ConfigCashSettingDTO) {
    this.checkIsSuperAdmin();

    await this.configService.upsert(CONFIG_SETTING_CASH_SCHOOL, dto);
    return this.responseSuccess('更新配置成功');
  }

  @Get('/cash/setting')
  async cashsettingGet() {
    this.checkIsSuperAdmin();

    const result = await this.configService.getConfig(
      CONFIG_SETTING_CASH_SCHOOL
    );
    return this.responseSuccess('ok', result);
  }

  @Get('/time/requirement')
  async timeRequirementGet() {
    this.checkIsSuperAdmin();
    const result = await this.configService.getConfig(
      CONFIG_TIME_REQUIREMENTS_SCHOOL
    );
    return this.responseSuccess('ok', result);
  }

  @Post('/time/requirement')
  @Validate()
  async timeRequirement(@Body() dto: TimeRequirementDTO) {
    this.checkIsSuperAdmin();
    await this.configService.upsert(CONFIG_TIME_REQUIREMENTS_SCHOOL, dto);
    return this.responseSuccess('更新配置成功');
  }
}
