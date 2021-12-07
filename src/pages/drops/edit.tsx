import styles from './index.less';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, message } from 'antd';
import { useRequest, history, useHistory } from 'umi';
import type { Location } from 'umi';
import { addOneDrop, updateOneDrop, getOneDropDetail } from '@/services/drops';
import OperateNftTable from '@/pages/drops/OperateNftTable';
import type { IDropPoolsInfo } from '@/pages/drops/OperateNftTable';
import type { EDropState, IAddDropParams } from '@/services/drops/types';
import AccountSelect from '@/components/AccountSelect';
import type { IBackground } from './BackgroundInput';
import { BackgroundInput } from './BackgroundInput';
import FromNowTimePicker from '@/components/FromNowTimePicker';
import MediaUploader from '@/components/MediaUploader';
import Image from '@/components/Image';
import type { FieldData } from 'rc-field-form/lib/interface';
import type { IResponse } from '@/services/types';

const { TextArea } = Input;

type FormActionType = 'create' | 'edit';

interface IFormContent {
  accountaddress: string;
  background?: IBackground;
  description: string;
  dropdate: number;
  title: string;
  videourl?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  pools?: IDropPoolsInfo;
}

const DropEdit: React.FC = () => {
  const [dropState, setDropState] = useState<EDropState>();
  const [coverImgUrl, setCoverImgUrl] = useState<string>();
  const [creatorAddress, setCreatorAddress] = useState<string>();
  // const [videoUrl, setVideoUrl] = useState<string>();

  const [form] = Form.useForm();
  const { location } = useHistory();
  const { query = {} } = location as Location;
  const dropId = query.id;
  const actionType: FormActionType = dropId ? 'edit' : 'create';

  // eslint-disable-next-line no-template-curly-in-string
  const typeTemplate = 'Please input a valid ${type}';
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    // required: '${label} is required!',
    types: {
      url: typeTemplate,
    },
  };

  const { loading: dropDataLoading } = useRequest(
    () => {
      return getOneDropDetail({
        dropsid: Number(dropId),
      });
    },
    {
      ready: !!dropId, // 一个!是将对象转为布尔型并取反，两个!是将取反后的布尔值再取反，相当于直接将非布尔类型值转为布尔类型值。
      onSuccess: (data) => {
        if (!data) {
          message.error(`Failed to fetch drop's info`);
          return;
        }

        setDropState(data.state);
        setCreatorAddress(data.accountaddress);

        if (data.coverimgurl && data.coverimgurl.length > 0) {
          setCoverImgUrl(data.coverimgurl);
        } else {
          setCoverImgUrl(undefined);
        }

        form.setFieldsValue({
          accountaddress: data.accountaddress,
          title: data.title,
          background: {
            bgType: data.coverimgurl && data.coverimgurl.length > 0 ? 'image' : 'color',
            imgUrl: data.coverimgurl,
            bgColor: data.bgcolor,
          },
          description: data.description,
          dropdate: data.dropdate,
          website: data.website,
          twitter: data.twitter,
          instagram: data.instagram,
          videourl: data.videourl,
          pools: {
            orderList: data.poolsinfo ? Array.from(new Array(data.poolsinfo.length).keys()) : [],
            idList: data.poolsinfo
              ? data.poolsinfo.map((pool) => {
                  return pool.auctionpoolid;
                })
              : [],
          },
        });
      },
    },
  );

  const handleFinish = (data: IFormContent) => {
    const rawParams = { ...data };
    delete rawParams.background;
    const params: IAddDropParams = {
      ...rawParams,
      coverimgurl: data.background?.imgUrl,
      bgcolor: data.background?.bgColor,
      poolids: data.pools ? data.pools.idList : [],
      ordernum: data.pools ? data.pools.orderList : [],
    };

    const messageHandler = (res: IResponse<unknown>) => {
      if (res.code === 1) {
        message.success('Added Successfully');

        history.push('/drops');
      } else if (res.msg?.includes('timestamp')) {
        message.error('Drop time is over due');
      } else {
        message.error('Add failed');
      }
    };

    const handleCreate = () => {
      addOneDrop(params).then((res) => {
        messageHandler(res);
      });
    };

    const handleEdit = () => {
      updateOneDrop({ ...params, id: Number(dropId) }).then((res) => {
        messageHandler(res);
      });
    };

    if (actionType === 'create') {
      handleCreate();
    } else {
      handleEdit();
    }
  };

  const handleFieldsChange = (changedFields: FieldData[]) => {
    if (changedFields[0].name[0] === 'background') {
      if (changedFields[0].value.imgUrl?.length > 0) {
        setCoverImgUrl(changedFields[0].value.imgUrl);
      } else {
        setCoverImgUrl(undefined);
      }
    }
  };

  const backgroundValidator = async (_: any, background: IBackground) => {
    if (
      !background ||
      (!background.bgColor && !background.imgUrl) ||
      (background.bgColor &&
        background.bgColor.length <= 0 &&
        background.imgUrl &&
        background.imgUrl.length <= 0)
    ) {
      return Promise.reject(new Error('Background cannot be empty'));
    }
    return Promise.resolve();
  };

  const initialValues = {
    background: {
      bgType: 'image',
      bgColor: '',
      imgUrl: '',
    },
    dropdate: null,
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <PageContainer loading={dropDataLoading}>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleFinish}
          onFieldsChange={handleFieldsChange}
          validateMessages={validateMessages}
          initialValues={initialValues}
        >
          <Form.Item
            label="Account"
            name="accountaddress"
            rules={[{ required: true, message: 'Account cannot be empty' }]}
          >
            <AccountSelect disabled={!!dropId} />
          </Form.Item>

          <Form.Item
            label="Background"
            name="background"
            rules={[
              { required: true },
              {
                validator: backgroundValidator,
              },
            ]}
          >
            <BackgroundInput />
          </Form.Item>

          {coverImgUrl && (
            <Form.Item label="Image Preview">
              <div className={styles['cover-image']}>
                <div className={styles.preview}>
                  <Image width={240} height={100} src={coverImgUrl} />
                  <span>On PC</span>
                </div>
                <div className={styles.preview}>
                  <Image width={73} height={100} src={coverImgUrl} />
                  <span>On phone</span>
                </div>
              </div>
            </Form.Item>
          )}

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title cannot be empty' }]}
          >
            <TextArea autoSize showCount maxLength={48} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description cannot be empty' }]}
          >
            <TextArea rows={5} showCount maxLength={300} />
          </Form.Item>

          <Form.Item
            name="dropdate"
            label="Drop Date"
            // TODO: 校验提交的时间是否过期
            rules={[{ required: true, message: 'Drop date cannot be empty' }]}
          >
            <FromNowTimePicker disabled={dropState === 2 || dropState === 3} />
          </Form.Item>

          <Form.Item name="videourl" label="video">
            <MediaUploader sizeLimit={30} fileType="video" />
          </Form.Item>

          {/* {form.getFieldValue('videourl') && (
            <Form.Item label="Video Preview">
              <video height={160} src={videoUrl} controls preload={'metadata'} />
            </Form.Item>
          )} */}

          <Form.Item label="Links">
            <Form.Item name="instagram" validateTrigger={['onBlur']} rules={[{ type: 'url' }]}>
              <Input addonBefore="Instagram" />
            </Form.Item>
            <Form.Item name="twitter" validateTrigger={['onBlur']} rules={[{ type: 'url' }]}>
              <Input addonBefore="Twitter" />
            </Form.Item>
            <Form.Item name="website" validateTrigger={['onBlur']} rules={[{ type: 'url' }]}>
              <Input addonBefore="Website" />
            </Form.Item>
          </Form.Item>

          {dropId && creatorAddress && (
            <Form.Item name="pools" label="NFTs">
              <OperateNftTable creatorAddress={creatorAddress} />
            </Form.Item>
          )}

          <Form.Item wrapperCol={{ offset: 7, span: 8 }} style={{ textAlign: 'right' }}>
            <Button
              htmlType="submit"
              style={{ margin: '0 8px' }}
              onClick={() => {
                handleReset();
              }}
            >
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              {actionType === 'edit' ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
