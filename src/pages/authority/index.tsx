import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';
import { useRequest } from 'umi';
import {
  defaultAuthorityPageParams,
  getAuthorityList,
  getAuthorityListFormatResult,
} from './actions/getAuthorityList';
import AuthorityTopView from './components/Top';
import columns from './components/columns';

const Index: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { tableProps, run, refresh, params } = useRequest(
    (props) => getAuthorityList({ ...props }, searchValue),
    {
      paginated: true,
      defaultParams: [defaultAuthorityPageParams],
      refreshDeps: [searchValue],
      formatResult: getAuthorityListFormatResult,
      cacheKey: 'authorityList',
    },
  );
  return (
    <PageContainer>
      <Card bordered={false}>
        <AuthorityTopView run={refresh} onSearch={setSearchValue} />
        <Table
          {...tableProps}
          columns={columns(() => {
            run({ ...params, ...defaultAuthorityPageParams });
          }, refresh)}
          rowKey="id"
        />
      </Card>
    </PageContainer>
  );
};

export default Index;
