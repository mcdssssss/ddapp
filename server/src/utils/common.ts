const dayjs = require('dayjs');
// 时间格式化
export const formatToLocalDate = (time: string) => {
  const targetDate = new Date(time).valueOf();
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
  } else if (
    reduce >= 24 * 60 * 60 * 1000 &&
    reduce < 7 * 24 * 60 * 60 * 1000
  ) {
    return parseInt((reduce / (24 * 60 * 60 * 1000)).toString()) + '天前';
  } else if (
    reduce >= 7 * 24 * 60 * 60 * 1000 &&
    reduce < 30 * 60 * 60 * 1000
  ) {
    return parseInt((reduce / (7 * 24 * 60 * 60 * 1000)).toString()) + '周前';
  } else if (
    reduce >= 30 * 24 * 60 * 60 * 1000 &&
    reduce < 6 * 30 * 60 * 60 * 1000
  ) {
    return (
      parseInt((reduce / (30 * 24 * 60 * 60 * 1000)).toString()) + '个月前'
    );
  } else if (
    reduce >= 6 * 30 * 24 * 60 * 60 * 1000 &&
    reduce < 7 * 30 * 60 * 60 * 1000
  ) {
    return (
      parseInt((reduce / (30 * 24 * 60 * 60 * 1000)).toString()) + '半年前'
    );
  } else {
    return dayjs(time).format('YYYY/MM/DD HH:mm');
  }
};

export const filterDeadlineTime = (time: number) => {
  const date = new Date(time);
  const nowDate = new Date();
  nowDate.setHours(23, 59, 59, 999);
  const dateval = date.valueOf();
  const nowdateval = nowDate.valueOf();
  const h24 = 24 * 60 * 60 * 1000;
  const h48 = 2 * h24;
  if (dateval - nowdateval <= 0) {
    return dayjs(time).format('HH:mm');
  } else if (dateval - nowdateval > 0 && dateval - nowdateval < h24) {
    return '明天 ' + dayjs(time).format('HH:mm');
  } else if (dateval - nowdateval >= h24 && dateval - nowdateval < h48) {
    return '后天 ' + dayjs(time).format('HH:mm');
  } else {
    dayjs(time).format('MM/DD HH:mm');
  }
};
