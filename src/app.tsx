import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { InitRequest } from './utils/request';
import type { RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
import { history } from 'umi';
import { LOGIN_PATH } from './tools/const';

InitRequest();

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  token?: API.Token;
  settings?: Partial<LayoutSettings>;
}> {
  const { token } = localStorage;
  return {
    settings: {},
    token,
  };
}

/**
 * ProLayout Api https://procomponents.ant.design/components/layout
 */
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {},
    footerRender: false,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login 。。
      if (!initialState?.token && location.pathname !== LOGIN_PATH) {
        history.push(LOGIN_PATH);
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
