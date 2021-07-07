import React from 'react';
import { Avatar, Image } from 'antd';
import { ImgErrorUrl } from '@/tools/const';
import AuthorityRowEditNoteName from '../components/editNotName';
import AuthorityRoleView from '../components/AuthorityRole';
import AuthorityActionView from '../components/AuthorityAction';
import type { IAuthorityItem } from '../actions/apiType';
import { AuthorityRoleEnum } from '../actions/apiType';
import { AddressCopyView } from '@/components/Address';
import { AdminIcon } from '@/components/svg/admin';
import styles from '../index.less';

type columnsType = {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: string, record: IAuthorityItem) => JSX.Element;
}[];
const columns: (run: () => void, refresh: () => void) => columnsType = (run, refresh) => {
  return [
    {
      title: 'Avatar',
      dataIndex: 'imgurl',
      key: 'userImageUrl',
      width: 150,
      render: (url, record) => (
        <div className={styles.avatar}>
          <Avatar shape="square" size={64} src={<Image src={url} fallback={ImgErrorUrl} />} />
          {record.opRole === AuthorityRoleEnum.super && (
            <AdminIcon width={15} height={15} className={styles.verify} />
          )}
        </div>
      ),
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => <AddressCopyView address={address} />,
    },
    {
      title: 'Type',
      dataIndex: 'opRole',
      key: 'opRole',
      render: (value, record) => <AuthorityRoleView id={record.id} value={value} run={refresh} />,
    },
    {
      title: 'Note name',
      dataIndex: 'notename',
      key: 'notename',
      render: (value, record) => <AuthorityRowEditNoteName id={record.id} value={value} />,
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <AuthorityActionView
          id={id as unknown as number}
          address={record.address}
          run={() => {
            run?.();
          }}
        />
      ),
    },
  ];
};

export default columns;
