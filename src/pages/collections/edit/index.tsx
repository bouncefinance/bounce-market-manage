import React from 'react';
import { history } from 'umi';
import ImageUploader from '@/components/ImageUploader';
import { addCollectionInfo } from '@/services/collection';
import type { IAddCollectionInfoParams } from '@/services/collection/types';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, message, Select, Space, Tooltip } from 'antd';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

// eslint-disable-next-line no-template-curly-in-string
const typeTemplate = 'Please input a valid ${type}';
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!',
  types: {
    url: typeTemplate,
  },
};

const EditBlindBox: React.FC = () => {
  const [form] = Form.useForm();

  const handleAdd = (data: any) => {
    const params: IAddCollectionInfoParams = {
      ...data,
      blockheight: +data.blockheight,
      timestamp: moment(data.timestamp.replace('+', '')).unix(),
      avatar: data.avatar.url,
      coverimgurl: data.coverimgurl.url,
      standard: +data.standard,
    };

    addCollectionInfo(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
      } else {
        message.error('Failed');
      }
      history.push('/collections');
    });
  };

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleAdd}
          validateMessages={validateMessages}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <Form.Item noStyle>
            <h1>Add collection</h1>
          </Form.Item>

          <Form.Item name="collection" label="collection address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="txhash" label="tx hash" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="timestamp"
            // label="时间戳"
            label={
              <Space>
                <span>time stamp</span>
                <Tooltip title="eg: Nov-20-2021 08:34:54 AM +UTC">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[
              { required: true },
              {
                validator(_, value) {
                  if (!value || moment(value.replace('+', '')).unix()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Please input legal time stamp from block explorer'),
                  );
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="blockheight" label="block height" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="cover">
            <Form.Item
              name="coverimgurl"
              noStyle
              rules={[{ required: true, message: 'Cover cannot be empty' }]}
            >
              <ImageUploader maxCount={1} limit={10 * 1024 * 1024} />
            </Form.Item>
            <span>Support jpg, png, gif, jpeg, jp2. Max size: 10MB.</span>
          </Form.Item>

          <Form.Item label="avatar">
            <Form.Item
              name="avatar"
              noStyle
              rules={[{ required: true, message: 'Avatar cannot be empty' }]}
            >
              <ImageUploader maxCount={1} limit={4 * 1024 * 1024} />
            </Form.Item>
            <span>Support jpg, png, gif, jpeg, jp2. Max size: 4MB.</span>
          </Form.Item>

          <Form.Item name="owneraddress" label="owner address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="brandname" label="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="description">
            <TextArea rows={4} showCount maxLength={300} />
          </Form.Item>

          <Form.Item name="brandsymbol" label="symbol" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="standard" label="standard" rules={[{ required: true }]}>
            <Select>
              <Option value={0}>721</Option>
              <Option value={1}>1155</Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7, span: 8 }} style={{ textAlign: 'right' }}>
            <Button
              htmlType="submit"
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              confirm
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default EditBlindBox;
