import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, Image, DatePicker, Modal, message, Select } from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { useState } from 'react';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';
import { IAddDropParams } from '@/services/drops/types';
import { addOneDrop } from '@/services/drops';
import { getMetaMskAccount, myweb3 } from '@/tools/conenct';
import AddNftModal from './AddNftModal';
import { useRequest } from 'umi';

const { confirm } = Modal;
const { Option } = Select;

const getAccountList = function (filter: '' = , likename: string = '', offset: number, limit: number = 5) {
  return request.post('/api/bouadmin/main/auth/getaccountsbylikename', {
    data: {
      filter,
      likename,
      limit,
      offset,
    },
  });
};

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<any>(null);
  const [accountAddress, setAccountAddress] = useState('');

  const {
    data: accountData,
    // loading: itemLoading,
    // pagination: itemPagination,
    // params: itemParams,
    tableProps: accountTableProps,
    run: searchAccount,
    refresh: reloadAccount,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getAccountList(searchText, (offset - 1) * limit, limit);
    },
    {
      paginated: true,
      cacheKey: 'accounts',
      defaultParams: [{ pageSize: 5, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  const handleEdit = (data: any) => {
    console.log(data);
    if (!accountAddress) return;
    const params: IAddDropParams = {
      accountaddress: accountAddress,
      website: data.website,
      twitter: data.twitter,
      Instagram: data.Instagram,
      title: data.title,
      description: data.description,
      bgcolor: data.bgcolor,
      coverimgurl: data.bgcolor,
      poolids: [1, 2, 3],
      ordernum: [1, 2, 3],
      dropdate: data.dropdate.unix(),
    };
    console.log('params: ', params);
    addOneDrop(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
      } else message.error('Add failed');
    });
  };

  

  return (
    <PageContainer>
      <Card>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={handleEdit}>
          <Form.Item name="cover" label="Cover">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
            >
              <Option value="1">Not Identified</Option>
              <Option value="2">Closed</Option>
              <Option value="3">Communicated</Option>
              <Option value="4">Identified</Option>
              <Option value="5">Resolved</Option>
              <Option value="6">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="cover" label="Cover">
            <ImageUploader
              maxCount={1}
              onChange={(file, items) => {
                setCoverImage(file);
              }}
            />
          </Form.Item>
          <Form.Item label="Preview">
            {coverImage && (
              <div className={styles['cover-image']}>
                <div className={styles['preview']}>
                  <Image
                    width={300}
                    height={100}
                    src={coverImage?.thumbUrl || coverImage?.url}
                    preview={false}
                  />
                </div>
                <div className={styles['preview']}>
                  <Image
                    width={80}
                    height={100}
                    src={coverImage?.thumbUrl || coverImage?.url}
                    preview={false}
                  />
                </div>
              </div>
            )}
          </Form.Item>
          <Form.Item name="bgcolor" label="Background Color">
            <ColorPicker value="#000" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title cannot be empty' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description cannot be empty' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dropdate"
            label="Drop Date"
            rules={[{ required: true, message: 'Drop date cannot be empty' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="Social Link">
            <Form.Item name="instagram">
              <Input addonBefore="Instagram" />
            </Form.Item>
            <Form.Item name="twitter">
              <Input addonBefore="Twitter" />
            </Form.Item>
            <Form.Item name="website">
              <Input addonBefore="Website" />
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <AddNftModal />
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
