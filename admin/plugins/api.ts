/* eslint-disable camelcase */
import Vue from 'vue';
import http from './http';
const api = {
  verifycode: () => http.get('/admin/verifycode'),
  login: (data: any) => http.post('/admin/login', data),
  adminInfo: () => http.get('/admin/info'),
  adminInfoSelf: () => http.get('/admin/info/self'),
  userSTS: () => http.get('/admin/sts'),
  userList: (data: any) => http.get('/admin/user/list', data),
  userStatus: (data: any) => http.put('/admin/user/status', data),
  hasSuper: () => http.get('/admin/super'),
  initAdmin: (data: any) => http.post('/admin/init', data),
  adminList: (data: any) => http.get('/admin/list', data),
  adminStatus: (data: any) => http.put('/admin/status', data),
  adminAdd: (data: any) => http.post('/admin/add', data),
  adminUpdate: (data: any) => http.put('/admin/update', data),
  adminUpdateSelf: (data: any) => http.put('/admin/update/self', data),
  adminSetpwd: (data: any) => http.put('/admin/setpwd', data),
  adminResetpwd: (data: any) => http.put('/admin/resetpwd', data),
  adminUpdatepwd: (data: any) => http.put('/admin/updatepwd', data),

  agentList: (data: any) => http.get('/admin/agent/list', data),
  agentStatus: (data: any) => http.put('/admin/agent/status', data),
  agentAdd: (data: any) => http.post('/admin/agent/add', data),
  agentUpdate: (data: any) => http.put('/admin/agent/update', data),
  agentResetpwd: (data: any) => http.put('/admin/agent/resetpwd', data),

  cityAdd: (data: any) => http.post('/admin/citys/add', data),
  cityUpdate: (data: any) => http.put('/admin/citys/update', data),
  cityStatus: (data: any) => http.put('/admin/citys/status', data),
  cityList: (data: any) => http.get('/admin/citys/list', data),
  cityValuationAdd: (data: any) => http.post('/admin/citys/valuation/add', data),
  cityValuationUpdate: (data: any) => http.put('/admin/citys/valuation/update', data),
  cityValuationList: (data: any) => http.get('/admin/citys/valuation/list', data),
  cityValuationDel: (data: any) => http.delete('/admin/citys/valuation/del', data),
  cityCreateChat: (data: any) => http.post('/admin/citys/corwx/appchat/create', data),

  adminAppauthPost: (data: any) => http.post('/admin/config/appauth', data),
  adminAppauthGet: (data: any) => http.get('/admin/config/appauth', data),
  adminAppMchPost: (data: any) => http.post('/admin/config/appmch', data),
  adminAppMchGet: (data: any) => http.get('/admin/config/appmch', data),
  adminMapPost: (data: any) => http.post('/admin/config/map', data),
  adminMapGet: () => http.get('/admin/config/map'),
  adminAliPost: (data: any) => http.post('/admin/config/ali', data),
  adminAliGet: () => http.get('/admin/config/ali'),
  adminCouponPost: (data: any) => http.post('/admin/config/coupon', data),
  adminCouponGet: () => http.get('/admin/config/coupon'),
  adminNoticePost: (data: any) => http.post('/admin/config/notice', data),
  adminNoticeGet: (data: any) => http.get('/admin/config/notice', data),
  adminCancelOrderPost: (data: any) => http.post('/admin/config/ordercancel', data),
  adminCancelOrderGet: () => http.get('/admin/config/ordercancel'),
  adminOrderFeePost: (data: any) => http.post('/admin/config/orderfee', data),
  adminOrderFeeGet: () => http.get('/admin/config/orderfee'),
  adminOrderReceivePost: (data: any) => http.post('/admin/config/orderreceive', data),
  adminOrderReceiveGet: () => http.get('/admin/config/orderreceive'),
  adminGuideUserPost: (data: any) => http.post('/admin/config/guide/user', data),
  adminGuideUserGet: () => http.get('/admin/config/guide/user'),
  adminGuideRiderPost: (data: any) => http.post('/admin/config/guide/rider', data),
  adminGuideRiderGet: () => http.get('/admin/config/guide/rider'),
  adminSharePost: (data: any) => http.post('/admin/config/share', data),
  adminShareGet: () => http.get('/admin/config/share'),
  adminIntegralPost: (data: any) => http.post('/admin/config/integral', data),
  adminIntegralGet: () => http.get('/admin/config/integral'),
  adminAgreementRiderPost: (data: any) => http.post('/admin/config/agreement/rider', data),
  adminAgreementRiderGet: () => http.get('/admin/config/agreement/rider'),
  adminCorwxPost: (data: any) => http.post('/admin/config/corwx', data),
  adminCorwxGet: () => http.get('/admin/config/corwx'),
  adminProtocolPost: (data: any) => http.post('/admin/config/protocol', data),
  adminProtocolGet: () => http.get('/admin/config/protocol'),
  adminWxSubscribePost: (data: any) => http.post('/admin/config/subscribe/wx', data),
  adminWxSubscribeGet: () => http.get('/admin/config/subscribe/wx'),
  adminConfigCashPost: (data: any) => http.post('/admin/config/cash', data),
  adminConfigCashGet: () => http.get('/admin/config/cash'),
  adminConfigCashSettingPost: (data: any) => http.post('/admin/config/cash/setting', data),
  adminConfigCashSettingGet: () => http.get('/admin/config/cash/setting'),
  adminConfigVkeyPost: (data: any) => http.post('/admin/config/vkey', data),
  adminConfigVkeyGet: () => http.get('/admin/config/vkey'),
  adminAlipaySubscribePost: (data: any) => http.post('/admin/config/subscribe/alipay', data),
  adminAlipaySubscribeGet: () => http.get('/admin/config/subscribe/alipay'),
  adminSystemSettingPost: (data: any) => http.post('/admin/config/setting', data),
  adminSystemSettingGet: () => http.get('/admin/config/setting'),
  adminConfigMiniApp: () => http.get('/admin/config/miniapp'),
  adminConfigOrdertypeGet: () => http.get('/admin/config/ordertype'),
  adminConfigOrdertypePost: (data: any) => http.post('/admin/config/ordertype', data),
  adminConfigTimeRequirementGet: () => http.get('/admin/config/time/requirement'),
  adminConfigTimeRequirementPost: (data: any) => http.post('/admin/config/time/requirement', data),
  adminConfigPrintGet: () => http.get('/admin/config/print'),
  adminConfigPrintPost: (data: any) => http.post('/admin/config/print', data),

  weightAdd: (data: any) => http.post('/admin/citys/weight/add', data),
  weightUpdate: (data: any) => http.put('/admin/citys/weight/update', data),
  weightList: (data: any) => http.get('/admin/citys/weight/list', data),
  weightDel: (data: any) => http.delete('/admin/citys/weight/del', data),

  tagGroupAdd: (data: any) => http.post('/admin/citys/tag/add', data),
  tagGroupUpdate: (data: any) => http.put('/admin/citys/tag/update', data),
  tagGroupList: (data: any) => http.get('/admin/citys/tag/list', data),
  tagGroupDel: (data: any) => http.delete('/admin/citys/tag/del', data),

  couponAdd: (data: any) => http.post('/admin/coupon/add', data),
  couponUpdate: (data: any) => http.put('/admin/coupon/update', data),
  couponStatus: (data: any) => http.put('/admin/coupon/status', data),
  couponList: (data: any) => http.get('/admin/coupon/list', data),
  couponSend: (data: any) => http.post('/admin/coupon/send', data),

  orderList: (data: any) => http.get('/admin/order/list', data),
  orderReceive: (data: any) => http.put('/admin/order/receive', data),
  orderDeliver: (data: any) => http.put('/admin/order/deliver', data),
  orderComplete: (data: any) => http.put('/admin/order/complete', data),
  orderCancel: (data: any) => http.put('/admin/order/cancel', data),
  orderCapitalTrendList: (data: any) => http.get('/admin/order/capitaltrend/list', data),

  riderList: (data: any) => http.get('/admin/rider/list', data),
  riderRegisterList: (data: any) => http.get('/admin/rider/register/list', data),
  riderAdd: (data: any) => http.post('/admin/rider/add', data),
  riderPass: (data: any) => http.put('/admin/rider/pass', data),
  riderRefuse: (data: any) => http.put('/admin/rider/refuse', data),
  riderReceiveSet: (data: any) => http.put('/admin/rider/receive/status', data),

  wxSubscribeAdd: (data: any) => http.post('/admin/wx/subscribe/message/addtemplate', data),
  wxSubscribeDel: (data: any) => http.post('/admin/wx/subscribe/message/deltemplate', data),
  wxSubscribeCate: () => http.get('/admin/wx/subscribe/message/getcategory'),
  wxSubscribeKeyword: (data: any) =>
    http.get('/admin/wx/subscribe/message/getpubtemplatekeywords', data),
  wxSubscribeTitles: (data: any) =>
    http.get('/admin/wx/subscribe/message/getpubtemplatetitles', data),
  wxSubscribeTemplates: () => http.get('/admin/wx/subscribe/message/gettemplate'),

  analysisTotal: () => http.get('/admin/analysis/total'),
  analysisOrderStatusDaily: (data: { beginDate: string; endDate: string }) =>
    http.get('/admin/analysis/order/status', data),
  analysisNewUser: (data: { beginDate: string; endDate: string }) =>
    http.get('/admin/analysis/new/user', data),
  analysisNewOrder: (data: { beginDate: string; endDate: string }) =>
    http.get('/admin/analysis/new/order', data),

  cashList: (data: any) => http.get('/admin/cash/list', data),
  cashSuccess: (data: any) => http.put('/admin/cash/success', data),
  cashFail: (data: any) => http.put('/admin/cash/fail', data),

  schoolUpdate: (data: any) => http.post('/admin/school/update', data),
  schoolUpdateService: (data: any) => http.put('/admin/school/update/service', data),
  schoolStatus: (data: any) => http.put('/admin/school/status', data),
  schoolList: (data: any) => http.get('/admin/school/list', data),
  schoolInfo: (data: { schoolNo: string }) => http.get('/admin/school/info', data),

  schoolAreaAdd: (data: any) => http.post('/admin/school/area/add', data),
  schoolAreaUpdate: (data: any) => http.put('/admin/school/area/update', data),
  schoolAreaStatus: (data: any) => http.put('/admin/school/area/status', data),
  schoolAreaDel: (data: any) => http.delete('/admin/school/area/del', data),
  schoolAreaList: (data: any) => http.get('/admin/school/area/list', data),
  schoolAreaAll: (data: any) => http.get('/admin/school/area/all', data),
  schoolAreaBuildList: (data: any) => http.get('/admin/school/area/build/list', data),

  schoolBuildAdd: (data: any) => http.post('/admin/school/area/build/add', data),
  schoolBuildUpdate: (data: any) => http.put('/admin/school/area/build/update', data),
  schoolBuildDel: (data: any) => http.delete('/admin/school/area/build/del', data),

  schoolCarouselUpsert: (data: any) => http.post('/admin/school/carousel/upsert', data),
  schoolCarouselGet: (data: any) => http.get('/admin/school/carousel/info', data),

  localtionSearch: (data: any) => http.get('/admin/map/location/search', data),
  adminSystemInfo: () => http.get('/admin/system'),

  takerAdd: (data: any) => http.post('/admin/taker/add', data),
  takerList: (data: any) => http.get('/admin/taker/list', data),
  takerPass: (data: any) => http.put('/admin/taker/pass', data),
  takerRefuse: (data: any) => http.put('/admin/taker/refuse', data),
  takerByMobile: (data: any) => http.get('/admin/taker/mobile', data),

  fileAdd: (data: any) => http.post('/admin/file/add', data),
  fileDel: (data: any) => http.delete('/admin/file/del', data),
  fileList: (data: any) => http.get('/admin/file/list', data),
  fileGroupAdd: (data: any) => http.post('/admin/file/group/add', data),
  fileGroupUpdate: (data: any) => http.put('/admin/file/group/update', data),
  fileGroupDel: (data: any) => http.delete('/admin/file/group/del', data),
  fileGroupList: (data: any) => http.get('/admin/file/group/list', data),
  fileMoveToGroup: (data: any) => http.put('/admin/file/group/move', data),

  richtextInfo: (data: any) => http.get('/admin/richtext/info', data),
  richtextList: (data: any) => http.get('/admin/richtext/list', data),
  richtextAdd: (data: any) => http.post('/admin/richtext/add', data),
  richtextUpdate: (data: any) => http.put('/admin/richtext/update', data),
  richtextDel: (data: any) => http.delete('/admin/richtext/del', data),
  richtextMoveToGroup: (data: any) => http.put('/admin/richtext/group/move', data),

  wxappList: (data: any) => http.get('/admin/wxapp/list', data),
  qqappList: (data: any) => http.get('/admin/qq/list', data),
  alipayList: (data: any) => http.get('/admin/alipay/list', data),

  corwxAppchatCreate: (data: any) => http.post('/admin/corwx/appchat/create', data),

  schoolOrderList: (data: any) => http.get('/admin/school/order/list', data),

  schoolOrderReceive: (data: any) => http.post('/admin/school/order/take', data),

  schoolOrderCancel: (data: any) => http.post('/admin/school/order/cancel', data),
  schoolOrderComplete: (data: any) => http.post('/admin/school/order/complete', data),
  schoolOrderCapitalTrendList: (data: any) =>
    http.get('/admin/school/order/capitaltrend/list', data),
  schoolorderOneClickHandle: (data: any) => http.post('/admin/school/order/handle', data),

  schoolAnlysisTotal: () => http.get('/admin/school/analysis/total'),
  schoolAnlysisBase: () => http.get('/admin/school/analysis/base'),
  schoolAnlysisTaker: (data: any) => http.get('/admin/school/analysis/taker', data),
  schoolAnlysisNewOrder: (data: any) => http.get('/admin/school/analysis/new/order', data),
  schoolAnlysisNewUser: (data: any) => http.get('/admin/school/analysis/new/user', data),

  anlysisProcess: () => http.get('/admin/analysis/process'),

  wxappUpload: (data: any) => http.post('/admin/wxapp/upload', data),
  alipayUpload: (data: any) => http.post('/admin/alipay/upload', data),

  alipayCliLogin: () => http.post('/admin/alipay/cli/login', {}),
  alipayCliProgress: () => http.get('/admin/alipay/cli/progress'),

  adminCashExportCheck: (data: any) => http.get('/admin/cash/export/check', data),

  schoolUpdateTakeout: (data: any) => http.put('/admin/school/update/takeout', data),
  schoolUpdateTakeoutGet: (data: any) => http.get('/admin/school/takeout', data)
};
Vue.prototype.$api = api;
export default api;
