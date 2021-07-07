import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';
import { useRequest } from 'umi';
import UserTopView from './components/top';
import columns from './components/columns';
import type { UserRoleType } from '@/services/user/types';
import { defaultUserPageParams, getUserList, getUserListFormatResult } from '@/services/user';

const Index: React.FC = () => {
  const [role, setRole] = useState<UserRoleType>();
  const [searchValue, setSearchValue] = useState('');
  const { tableProps, run, refresh, params } = useRequest(
    (props) => getUserList({ ...props, role }, searchValue),
    {
      paginated: true,
      defaultParams: [defaultUserPageParams],
      refreshDeps: [role, searchValue],
      formatResult: getUserListFormatResult,
      cacheKey: 'UserList',
    },
  );
  return (
    <PageContainer>
      <Card bordered={false}>
        <UserTopView run={refresh} onRoleChange={setRole} onSearch={setSearchValue} />
        <Table
          {...tableProps}
          columns={columns(() => {
            run({ ...params, ...defaultUserPageParams });
          }, refresh)}
          rowKey="id"
        />
      </Card>
    </PageContainer>
  );
};

export default Index;
