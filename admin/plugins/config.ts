import dayjs from 'dayjs';
export const AutoSaveTime = 5 * 60 * 1000;
// 项目截图路径
export const ProjectScreenshot = 'project/screenshot/';
// 用户头像路径
export const UserAvatar = 'user/avatar/';

export const MaterialScreenshot = 'material/screenshot/';

export const Enterprise = 'enterprise/';

// 时间格式化
export const formatToLocalDate = (time: string) => {
  const targetDate = parseInt(time);
  const now = Date.now();
  const reduce = now - targetDate;
  if (reduce < 60 * 1000) {
    return '刚刚';
  } else if (reduce >= 60 * 1000 && reduce < 30 * 60 * 1000) {
    return parseInt((reduce / (60 * 1000)).toString()) + '分钟前';
  } else if (reduce >= 30 * 60 * 1000 && reduce < 60 * 60 * 1000) {
    return '半小时前';
  } else if (reduce >= 60 * 60 * 1000 && reduce < 24 * 60 * 60 * 1000) {
    return parseInt((reduce / (60 * 60 * 1000)).toString()) + '小时前';
  } else if (reduce >= 24 * 60 * 60 * 1000 && reduce < 7 * 24 * 60 * 60 * 1000) {
    return parseInt((reduce / (24 * 60 * 60 * 1000)).toString()) + '天前';
  } else if (reduce >= 7 * 24 * 60 * 60 * 1000 && reduce < 30 * 60 * 60 * 1000) {
    return parseInt((reduce / (7 * 24 * 60 * 60 * 1000)).toString()) + '周前';
  } else if (reduce >= 30 * 24 * 60 * 60 * 1000 && reduce < 6 * 30 * 60 * 60 * 1000) {
    return parseInt((reduce / (30 * 24 * 60 * 60 * 1000)).toString()) + '个月前';
  } else if (reduce >= 6 * 30 * 24 * 60 * 60 * 1000 && reduce < 7 * 30 * 60 * 60 * 1000) {
    return parseInt((reduce / (30 * 24 * 60 * 60 * 1000)).toString()) + '半年前';
  } else {
    return dayjs(time).format('YYYY/MM/DD HH:mm');
  }
};

// 'distance' | 'weight' | 'time' | 'festival'
export const ruleTypes = [
  { label: '距离', value: 'distance', color: 'orange' },
  { label: '重量', value: 'weight', color: 'blue' },
  { label: '时间段', value: 'time', color: 'pink' },
  { label: '节日', value: 'festival', color: 'green' }
];

export const serviceItems = [
  { label: '跑腿服务', color: '#00CC99', icon: 'icon-running', value: 'errands' },
  { label: '陪玩陪练', color: '#9900FF', icon: 'icon-play', value: 'play' },
  { label: '软件安装', color: '#33CCCC', icon: 'icon-software', value: 'software' },
  { label: '快递代取', color: '#33CC33', icon: 'icon-express', value: 'express' }
] as { label: string; color: string; icon: string; value: string; disabled?: boolean }[];

export const repairSerices = [{ label: '电脑维修' }, { label: '手机维修' }, { label: '平板维修' }];

export const isSass = (): boolean => {
  const host = window.location.host;
  if (host.includes('sass') || host.includes('saas') || host.includes('10.0')) {
    return true;
  }
  return false;
};
export const sassFilter = () => {
  const host = window.location.host;
  let version = 'all';
  const slpit = host.split('.');
  if (slpit.length > 2) {
    if (slpit[2] === 'school') {
      version = 'school';
    } else if (slpit[2] === 'community') {
      version = 'community';
    } else if (slpit[2] === 'city') {
      version = 'city';
    }
  }
  return {
    isSass: isSass(),
    version
  };
};

export const cronFormat = {
  EVERY_SECOND: '* * * * * *', // 每秒钟
  EVERY_MINUTE: '0 * * * * *', //
  EVERY_HOUR: '0 0 * * * *',
  EVERY_DAY: '0 0 0 * * *',
  EVERY_DAY_ZERO_FIFTEEN: '0 15 0 * * *',
  EVERY_DAY_ONE_FIFTEEN: '0 15 1 * * *',
  EVERY_PER_5_SECOND: '*/5 * * * * *',
  EVERY_PER_10_SECOND: '*/10 * * * * *',
  EVERY_PER_30_SECOND: '*/30 * * * * *',
  EVERY_PER_5_MINUTE: '0 */5 * * * *',
  EVERY_PER_10_MINUTE: '0 */10 * * * *',
  EVERY_PER_30_MINUTE: '0 */30 * * * *'
};

export const crons = [
  { label: '每秒钟执行一次', value: cronFormat.EVERY_SECOND },
  { label: '每分钟执行一次', value: cronFormat.EVERY_MINUTE },
  { label: '每小时整点执行一次', value: cronFormat.EVERY_HOUR },
  { label: '每天 0 点执行一次', value: cronFormat.EVERY_DAY },
  { label: '每天 0 点 15 分执行一次', value: cronFormat.EVERY_DAY_ZERO_FIFTEEN },
  { label: '每天 1 点 15 分执行一次', value: cronFormat.EVERY_DAY_ONE_FIFTEEN },
  { label: '每隔 5 秒执行一次', value: cronFormat.EVERY_PER_5_SECOND },
  { label: '每隔 10 秒执行一次', value: cronFormat.EVERY_PER_10_SECOND },
  { label: '每隔 30 秒执行一次', value: cronFormat.EVERY_PER_30_SECOND },
  { label: '每隔 5 分钟执行一次', value: cronFormat.EVERY_PER_5_MINUTE },
  { label: '每隔 10 分钟执行一次', value: cronFormat.EVERY_PER_10_MINUTE },
  { label: '每隔 30 分钟执行一次', value: cronFormat.EVERY_PER_30_MINUTE }
];
