import React, { useState } from 'react';
import { Avatar, Image, Switch, message, Modal } from 'antd';
import { useIntl } from 'umi';
import { ImgErrorUrl } from '@/tools/const';
import UserRoleView from '../components/userRole';
import { updateUserCreation, updateUserDisplay } from '../actions/updateUser';
import { AddressCopyView } from '@/components/Address';
import { VerifyIcon } from '@/components/verify';
import styles from '../index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { IUserItem, UserCreationType, UserDisableType } from '@/services/user/types';
import { UserCreationEnum, UserDisableEnum, UserRoleEnum } from '@/services/user/types';

const { confirm } = Modal;

type columnsType = {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: string, record: IUserItem) => JSX.Element;
}[];

const columns: (run: () => void, refresh: () => void) => columnsType = (run, refresh) => {
  return [
    {
      title: 'Avatar',
      dataIndex: 'imgurl',
      key: 'imgurl',
      render: (url, record) => (
        <div className={styles.avatar}>
          <Avatar shape="square" size={64} src={<Image src={url} fallback={ImgErrorUrl} />} />
          {record.identity === UserRoleEnum.Verified && <VerifyIcon className={styles.verify} />}
        </div>
      ),
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Address',
      dataIndex: 'accountaddress',
      key: 'accountaddress',
      render: (address) => <AddressCopyView address={address} />,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Identity',
      dataIndex: 'identity',
      key: 'identity',
      render: (value, record) => <UserRoleView id={record.id} value={value} run={refresh} />,
    },
    {
      title: 'Hide Creation',
      dataIndex: 'id',
      key: 'state',
      render: function Render(id, record) {
        const [oldValue, setValue] = useState<UserCreationType>(record.display);
        const [loading, setLoading] = useState(false);
        const intl = useIntl();
        const onChange = (checked: boolean) => {
          confirm({
            title: intl.formatMessage(
              { id: 'pages.account.hideCreationButton' },
              { v: intl.formatMessage({ id: checked ? 'g.hide' : 'g.show' }) },
            ),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage(
              { id: 'pages.account.hideCreation' },
              { v: intl.formatMessage({ id: checked ? 'g.hide' : 'g.show' }) },
            ),
            onOk: async () => {
              setLoading(true);
              const display: UserCreationType = checked
                ? UserCreationEnum.Disable
                : UserCreationEnum.Normal;
              const isOk = await updateUserCreation({ id, display });
              setLoading(false);
              if (isOk) {
                message.success('Set Success 🎉 🎉 🎉');
                setValue(display);
                if (refresh) refresh();
                return;
              }
              message.error('error');
            },
          });
        };
        return (
          <Switch
            loading={loading}
            checked={oldValue === UserCreationEnum.Disable}
            onChange={onChange}
          />
        );
      },
    },
    {
      title: 'Disable',
      dataIndex: 'id',
      key: 'display',
      render: function Render(id, record) {
        const [oldValue, setValue] = useState<UserDisableType>(record.state);
        const [loading, setLoading] = useState(false);
        const intl = useIntl();
        const onChange = (checked: boolean) => {
          confirm({
            title: intl.formatMessage(
              { id: 'pages.account.disableButton' },
              { v: intl.formatMessage({ id: checked ? 'g.disable' : 'g.enable' }) },
            ),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage(
              { id: 'pages.account.Disable' },
              { v: intl.formatMessage({ id: checked ? 'g.disable' : 'g.enable' }) },
            ),
            onOk: async () => {
              setLoading(true);
              const state: UserDisableType = checked
                ? UserDisableEnum.Disable
                : UserDisableEnum.Normal;
              const isOk = await updateUserDisplay({ id, state });
              setLoading(false);
              if (isOk) {
                message.success('Set Success 🎉 🎉 🎉');
                setValue(state);
                if (refresh) refresh();
                return;
              }
              message.error('error');
            },
          });
        };
        return (
          <Switch
            loading={loading}
            checked={oldValue === UserDisableEnum.Disable}
            onChange={onChange}
          />
        );
      },
    },
  ];
};

export default columns;
