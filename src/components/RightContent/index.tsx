import { Space } from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import ChainSelect from './ChainSelect';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState) {
    return null;
  }
  return (
    <Space className={styles.right}>
      <ChainSelect />
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
