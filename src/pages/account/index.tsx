import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Avatar, Image, Card, Switch, message, Modal } from 'antd';
import { useIntl, useRequest } from 'umi';
import { ImgErrorUrl } from '@/tools/const';
import UserRoleView from './components/userRole';
import type { IUserItem, UserCreationType, UserDisableType, UserRoleType } from './actions/apiType';
import { UserCreationEnum, UserDisableEnum, UserRoleEnum } from './actions/apiType';
import { defaultUserPageParams, getUserList, getUserListFormatResult } from './actions/getUser';
import UserTopView from './components/top';
import { updateUserCreation, updateUserDisplay } from './actions/updateUser';
import { AddressCopyView } from '@/components/Address';
import { VerifyIcon } from '@/components/verify';
import styles from './index.less'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal

const index: React.FC = () => {
  const [role, setRole] = useState<UserRoleType>();
  const [searchValue, setSearchValue] = useState('');
  const { tableProps, run, refresh, params } = useRequest((props) => getUserList({ ...props, role }, searchValue), {
    paginated: true,
    defaultParams: [defaultUserPageParams],
    refreshDeps: [role, searchValue],
    formatResult: getUserListFormatResult,
    cacheKey: 'UserList',
  })
  return (
    <PageContainer>
      <Card bordered={false}>
        <UserTopView run={refresh} onRoleChange={setRole} onSearch={setSearchValue} />
        <Table {...tableProps} columns={columns(() => {
          run({ ...params, ...defaultUserPageParams })
        })} rowKey="id" />
      </Card>
    </PageContainer>
  );
};

export default index;

type columns = {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: string, record: IUserItem) => JSX.Element;
}[]
const columns: (run: () => void) => columns = (run) => {
  return [
    {
      title: "Avatar",
      dataIndex: "imgurl",
      key: "imgurl",
      render: (url, record) => <div className={styles.avatar}>
        <Avatar
          shape="square"
          size={64}
          src={<Image src={url} fallback={ImgErrorUrl} />}
        />
        {record.identity === UserRoleEnum.Verified && <VerifyIcon className={styles.verify} />}
      </div>
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
      render: (address) => <AddressCopyView address={address} />
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
      render: (value, record) => <UserRoleView id={record.id} value={value} run={run} />
    },
    {
      title: 'Hide Creation',
      dataIndex: 'id',
      key: 'state',
      render: (id, record) => {
        const [oldValue, setValue] = useState<UserCreationType>(record.state)
        const [loading, setLoading] = useState(false)
        const intl = useIntl()
        const onChange = (checked: boolean) => {
          confirm({
            title: intl.formatMessage({ id: 'pages.account.hideCreationButton' }, { v: intl.formatMessage({ id: checked ? 'g.hide' : 'g.show' }) }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({ id: 'pages.account.hideCreation' }, { v: intl.formatMessage({ id: checked ? 'g.hide' : 'g.show' }) }),
            onOk: async () => {
              setLoading(true)
              const state: UserCreationType = checked ? UserCreationEnum.Disable : UserCreationEnum.Normal
              const isOk = await updateUserCreation({ id, state })
              setLoading(false)
              if (isOk) {
                message.success('Set Success 🎉 🎉 🎉')
                setValue(state)
                run && run()
                return
              }
              message.error('error')
            },
          });
        }
        return <Switch
          loading={loading}
          checked={oldValue === UserCreationEnum.Disable}
          onChange={onChange}
        />
      }
    },
    {
      title: 'Disable',
      dataIndex: 'id',
      key: 'display',
      render: (id, record) => {
        const [oldValue, setValue] = useState<UserDisableType>(record.display)
        const [loading, setLoading] = useState(false)
        const intl = useIntl()
        const onChange = (checked: boolean) => {
          confirm({
            title: intl.formatMessage({ id: 'pages.account.disableButton' }, { v: intl.formatMessage({ id: checked ? 'g.disable' : 'g.enable' }) }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({ id: 'pages.account.Disable' }, { v: intl.formatMessage({ id: checked ? 'g.disable' : 'g.enable' }) }),
            onOk: async () => {
              setLoading(true)
              const display: UserDisableType = checked ? UserDisableEnum.Disable : UserDisableEnum.Normal
              const isOk = await updateUserDisplay({ id, display })
              setLoading(false)
              if (isOk) {
                message.success('Set Success 🎉 🎉 🎉')
                setValue(display)
                run && run()
                return
              }
              message.error('error')
            }
          })
        }
        return <Switch
          loading={loading}
          checked={oldValue === UserDisableEnum.Disable}
          onChange={onChange}
        />
      }
    }
  ]
}