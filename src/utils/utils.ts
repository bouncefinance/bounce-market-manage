import moment from 'moment';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

const range = (start: any, end: any) => {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
};

export const disabledDate = (currentDate: any) =>
  currentDate && currentDate < moment().subtract(1, 'day').endOf('day');

export const disabledTime = (date: any) => {
  const hours = moment().hours();
  const minutes = moment().minutes();
  // 当日只能选择当前时间之后的时间点
  if (date && moment(date).date() === moment().date()) {
    if (moment(date).hour() === moment().hour())
      return {
        disabledHours: () => range(0, 24).splice(0, hours),
        disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
      };
    return {
      disabledHours: () => range(0, 24).splice(0, hours),
    };
  }
  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
  };
};
