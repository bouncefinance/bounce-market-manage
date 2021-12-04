import moment from 'moment';
import styles from './index.less';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, Select } from 'antd';
import { useRequest, useLocation, history } from 'umi';
import { addOneDrop, updateOneDrop, getOneDropDetail } from '@/services/drops';
import { getAllPoolsByCreatorAddress } from '@/services/pool';
import { getAccountByAddress } from '@/services/user';
import type { IUserItem } from '@/services/user/types';
import OperateNftTable from '@/pages/drops/OperateNftTable2';
import type { IPoolResponse } from '@/services/pool/types';
import type { DropsState, IPoolsInfo } from '@/services/drops/types';
import { AccountSelect } from '@/components/AccountSelect';
import { BackgroundInput, IBackground } from './BackgroundInput';
import FromNowTimePicker from '@/components/FromNowTimePicker';
import MediaUploader from '@/components/MediaUploader';
import Image from '@/components/Image';
import { FieldData } from 'rc-field-form/lib/interface';

const { TextArea } = Input;

type FormActionType = 'create' | 'edit';

const DropEdit: React.FC = () => {
  const [dropState, setDropState] = useState<DropsState>();
  const [coverImgUrl, setCoverImgUrl] = useState<string>();
  const [videoUrl, setVideoUrl] = useState<string>();

  const [form] = Form.useForm();
  const location = useLocation();
  const currentDropId = location['query']?.id || '';

  // eslint-disable-next-line no-template-curly-in-string
  const typeTemplate = 'Please input a valid ${type}';
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    // required: '${label} is required!',
    types: {
      url: typeTemplate,
    },
  };

  const { data: dropData, loading: dropDataLoading } = useRequest(
    (dropsid: number) => {
      return getOneDropDetail({
        dropsid: Number(dropsid),
      });
    },
    {
      defaultParams: [currentDropId],
      onSuccess: (data) => {
        console.log('data in get drop: ', data);

        form.setFieldsValue({
          accountaddress: data?.accountaddress,
          background: {
            bgType: data?.coverimgurl?.length > 0 ? 'image' : 'color',
            imgUrl: data?.coverimgurl,
            bgcolor: data?.bgcolor,
          },
          nfts: {
            orderList: data?.poolsinfo
              ? Array.from(new Array(data?.poolsinfo.length).keys())
              : undefined,
            idList: data?.poolsinfo?.map((pool) => {
              return pool.auctionpoolid;
            }),
          },
        });
      },
    },
  );

  useEffect(() => {
    if (!currentDropId || !dropData || dropDataLoading) {
      return;
    }

    setDropState(dropData.state);

    // form.setFieldsValue({
    //   title: dropData.title,
    //   description: dropData.description,
    //   website: dropData.website,
    //   twitter: dropData.twitter,
    //   instagram: dropData.instagram,
    //   bgcolor: dropData.bgcolor,
    //   coverimgurl: dropData.coverimgurl ? image : null,
    //   videourl: dropData.videourl ? video : null,
    //   dropdate: moment(dropData.dropdate * 1000),

    //   accountaddress: dropData.accountaddress,
    //   background: {
    //     bgType: dropData.coverimgurl.length > 0 ? 'image' : 'color',
    //     imgUrl: dropData.coverimgurl,
    //     bgcolor: dropData.bgcolor,
    //   },

    //   nfts: {
    //     orderList: dropData.poolsinfo
    //       ? Array.from(new Array(dropData.poolsinfo.length).keys())
    //       : undefined,
    //     idList: dropData.poolsinfo?.map((pool) => {
    //       return pool.auctionpoolid;
    //     }),
    //   },
    // });
  }, [currentDropId, dropData, dropDataLoading]);

  const handleEdit = (data: any) => {
    console.log('data: ', data);
    // if (!selectedAccount) return;

    // const params = {
    //   accountaddress: selectedAccount.accountaddress,
    //   website: data.website,
    //   twitter: data.twitter,
    //   instagram: data.instagram,
    //   title: data.title,
    //   description: data.description,
    //   bgcolor,
    //   coverimgurl,
    //   videourl: data.videourl?.url || '',
    //   poolids: selectedPoolList?.map((nft) => {
    //     return nft.id;
    //   }),
    //   ordernum: new Array(selectedPoolList?.length).fill(0).map((_, index) => {
    //     return index;
    //   }),
    //   dropdate: data.dropdate.unix(),
    // };

    // if (currentDropId) {
    //   updateOneDrop({ ...params, id: Number(currentDropId) }).then((res) => {
    //     if (res.code === 1) {
    //       message.success('Updated Successfully');
    //       history.push('/drops');
    //     } else if (res.msg?.includes('timestamp')) message.error('Drop time is over due');
    //     else message.error('Update failed');
    //   });
    // } else {
    //   addOneDrop(params).then((res) => {
    //     if (res.code === 1) {
    //       message.success('Added Successfully');
    //       history.push('/drops');
    //     } else if (res.msg?.includes('timestamp')) message.error('Drop time is over due');
    //     else message.error('Add failed');
    //   });
    // }
  };

  const handleFinish = (data: any, actionType: FormActionType) => {
    console.log('data: ', data);

    const params = {};

    const handleCreate = () => {};

    const handleEdit = () => {};
  };

  const handleFieldsChange = (changedFields: FieldData[]) => {
    console.log('changedFields: ', changedFields);
    if (changedFields[0].name[0] === 'background') {
      if (changedFields[0].value.imgUrl?.length > 0) {
        setCoverImgUrl(changedFields[0].value.imgUrl);
      } else {
        setCoverImgUrl(undefined);
      }
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleEdit}
          onFieldsChange={handleFieldsChange}
          validateMessages={validateMessages}
        >
          <Form.Item
            label="Account"
            name="accountaddress"
            rules={[{ required: true, message: 'Account cannot be empty' }]}
          >
            <AccountSelect disabled={currentDropId.length > 0} />
          </Form.Item>

          <Form.Item
            label="Background"
            name="background"
            rules={[
              { required: true },
              {
                validator: async (_, background: IBackground) => {
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
                },
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

          {currentDropId.length > 0 && (
            <Form.Item name="nfts" label="NFTs">
              <OperateNftTable creatorAddress={form.getFieldValue('accountaddress')} />
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
              {currentDropId ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
