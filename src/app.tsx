import React from 'react';
import { InitRequest } from './utils/request';
import type { RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
import { history } from 'umi';
import { LOGIN_PATH } from './tools/const';
import { CHAIN_CACHE_KEY } from './models/login';
import { TokenSymbol } from './types';
// import { getUserRole } from '@/services/user';

InitRequest();

/**
 * ProLayout Api https://procomponents.ant.design/components/layout
 */
export const getInitialState = async () => {
  try {
    const { tokens } = JSON.parse(sessionStorage.getItem(CHAIN_CACHE_KEY)!);
    return { currentUser: tokens[TokenSymbol.BSC] };
  } catch (err) {
    return { currentUser: { token: '', opRole: 0 } };
  }
};

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {},
    footerRender: false, 
    onPageChange: () => {
      const { location } = history;
      const { currentUser } = initialState || {};
      // 如果没有登录，重定向到 login
      if (!currentUser?.token && location.pathname !== LOGIN_PATH) {
        history.push(LOGIN_PATH);
      }
    },
    menuHeaderRender: undefined,
    // ...initialState?.settings,
  };
};
