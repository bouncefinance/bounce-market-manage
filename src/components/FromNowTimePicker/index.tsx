import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';

export type IFromNowTimePickerProps = {
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
};

/**
 * 返回一个元素在指定范围内的数组
 * @param start
 * @param end
 * @returns
 */
const range = (start: any, end: any) => {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
};

const disabledDate = (currentDate: any) =>
  currentDate && currentDate < moment().subtract(1, 'day').endOf('day');

const disabledTime = (date: any) => {
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

const FromNowTimePicker: React.FC<IFromNowTimePickerProps> = ({ disabled = false }) => {
  return (
    <DatePicker
      value={value}
      disabled={disabled}
      inputReadOnly
      format={'YYYY-MM-DD HH:mm'}
      showTime={{ defaultValue: moment().add(1, 'minute') }}
      showNow={false}
      disabledDate={disabledDate}
      disabledTime={disabledTime}
    />
  );
};

export default FromNowTimePicker;
