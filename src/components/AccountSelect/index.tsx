import { getAccountByAddress } from '@/services/user';
import type { IUserItem } from '@/services/user/types';
import { List, Select, Image, Space, Tag, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';

const { Option } = Select;

export type IAccountSelectProps = {
  value?: any;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
};

const AccountSelect: React.FC<IAccountSelectProps> = ({ value, onChange, disabled = false }) => {
  const [selectedAddress, setSelectedAddress] = useState<string>();

  useEffect(() => {
    setSelectedAddress(value);
  }, [value]);

  // 根据地址查询账户信息
  const {
    data: accountData,
    loading: accountLoading,
    run: searchAccount,
  } = useRequest(
    (accountaddress) => {
      return getAccountByAddress({
        accountaddress,
      });
    },
    {
      manual: true,
      cacheKey: 'accounts',
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  const options = accountData?.list?.map((account: IUserItem) => {
    return (
      <Option key={account.id} value={account.accountaddress} disabled={account.identity === 1}>
        <List.Item.Meta
          avatar={<Image src={account?.imgurl} width={50} height={50} />}
          title={
            <Space>
              <span>{account?.username}</span>
              {account?.identity === 1 ? (
                <Tag color="error">Unverfied</Tag>
              ) : (
                <Tag color="blue">Verfied</Tag>
              )}
            </Space>
          }
          description={<span>{account?.accountaddress}</span>}
        />
      </Option>
    );
  });

  return (
    <>
      <Select
        // open
        loading={accountLoading}
        optionLabelProp={'value'}
        defaultActiveFirstOption={false}
        disabled={disabled}
        showSearch
        value={selectedAddress}
        placeholder="Input Address"
        // 内容改变就会触发搜索
        onSearch={(inputValue) => {
          if (inputValue.length > 0) {
            searchAccount(inputValue);
          }
        }}
        // 选中项改变触发onChange
        onChange={(address) => {
          setSelectedAddress(
            accountData?.list?.find((account: IUserItem) => {
              return account.accountaddress === address;
            }).accountaddress,
          );

          onChange?.(address);
        }}
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      >
        {options}
      </Select>
    </>
  );
};

export { AccountSelect };
