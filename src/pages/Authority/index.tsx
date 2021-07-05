import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Avatar, Image, Card } from 'antd';
import { useRequest } from 'umi';
import { defaultAuthorityPageParams, getAuthorityList, getAuthorityListFormatResult } from './actions/getAuthorityList';
import { ImgErrorUrl } from '@/tools/const';
import AuthorityTopView from './components/Top';
import AuthorityRowEditNoteName from './components/editNotName';
import AuthorityRoleView from './components/AuthorityRole';
import AuthorityActionView from './components/AuthorityAction';
import { IAuthorityItem } from './actions/apiType';
import { AddressCopyView } from '@/components/Address';

const index: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { tableProps, run, refresh, params } = useRequest((props) => getAuthorityList({ ...props }, searchValue), {
    paginated: true,
    defaultParams: [defaultAuthorityPageParams],
    refreshDeps: [searchValue],
    formatResult: getAuthorityListFormatResult,
    cacheKey: 'authorityList',
  })
  return (
    <PageContainer>
      <Card bordered={false}>
        <AuthorityTopView run={refresh} onSearch={setSearchValue} />
        <Table {...tableProps} columns={columns(() => {
          run({ ...params, ...defaultAuthorityPageParams })
        })} rowKey="id" />
      </Card>
    </PageContainer>
  );
};

export default index;

type columns = Array<{
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: string, record: IAuthorityItem) => JSX.Element;
}>
const columns: (run: () => void) => columns = (run) => {
  return [
    {
      title: "Avatar",
      dataIndex: "userImageUrl",
      key: "userImageUrl",
      render: (url, record) => <Avatar
        shape="square"
        size={64}
        src={<Image src={url} fallback={ImgErrorUrl} />}
      />
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => <AddressCopyView address={address} />
    },
    {
      title: 'Type',
      dataIndex: 'opRole',
      key: 'opRole',
      render: (value, record) => <AuthorityRoleView id={record.id} value={value} />
    },
    {
      title: 'Note name',
      dataIndex: 'notename',
      key: 'notename',
      render: (value, record) => <AuthorityRowEditNoteName id={record.id} value={value} />
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <AuthorityActionView id={id as unknown as number} address={record.address} run={() => {
        run && run()
      }} />
    },
  ]
}