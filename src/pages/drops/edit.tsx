import moment from 'moment';
import styles from './index.less';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Form,
  Input,
  DatePicker,
  Modal,
  message,
  Space,
  List,
  Select,
  Empty,
  Tag,
} from 'antd';
import Image from '@/components/Image';
import ImageUploader from '@/components/ImageUploader';
import VideoUploader from '@/components/VideoUploader';
import ColorPicker from '@/components/ColorPicker';
import { useRequest, useLocation, history } from 'umi';
import { addOneDrop, updateOneDrop, getOneDropDetail } from '@/services/drops';
import { getAllPoolsByCreatorAddress } from '@/services/pool';
import { getAccountByAddress } from '@/services/user';
import type { IUserItem } from '@/services/user/types';
import AddNftTable from '@/pages/drops/AddNftTable';
import OperateNftTable from '@/pages/drops/OperateNftTable';
import type { IPoolResponse } from '@/services/pool/types';
import { DropsState, IDropDetailResponse } from '@/services/drops/types';

const { Option } = Select;

type BGType = 'cover' | 'bgcolor';

function range(start: any, end: any) {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
}
const disabledDate = (currentDate: any) =>
  currentDate && currentDate < moment().subtract(1, 'day').endOf('day');

const disabledTime = (date: any) => {
  const hours = moment().hours();
  const minutes = moment().minutes();
  // 当日只能选择当前时间之后的时间点
  if (date && moment(date).date() === moment().date()) {
    if (moment(date).hour() === moment().hour())
      return {
        disabledHours: () => range(0, 24).splice(0, hours),
        disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
      };
    return {
      disabledHours: () => range(0, 24).splice(0, hours),
    };
  }
  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
  };
};

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<IUserItem>();
  const [addNftModalVisible, setAddNftModalVisible] = useState(false);
  const [tempSelectedKeys, setTempSelectedKeys] = useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [tempSelectedPoolList, setTempSelectedPoolList] = useState<IPoolResponse[]>([]);
  const [selectedPoolList, setSelectedPoolList] = useState<IPoolResponse[]>([]);
  const [backgroundType, setBackgroundType] = useState<BGType>('cover');
  const [dropState, setDropState] = useState<DropsState>();

  const [form] = Form.useForm();
  const location = useLocation();
  const currentDropId = location['query']?.id || '';

  useEffect(() => {
    setSelectedPoolList([]);
    setTempSelectedPoolList([]);
  }, [selectedAccount]);

  // getAccountByAddress
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

  const { data: dropData, loading: dropDataLoading } = useRequest(
    (dropsid: number) => {
      return getOneDropDetail({
        dropsid: Number(dropsid),
      });
    },
    {
      defaultParams: [currentDropId],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  useEffect(() => {
    const list = dropData?.list || [];
    if (currentDropId && !dropDataLoading && list.length) {
      const selecteds = list.map((drop: any) => {
        return drop.auctionpoolid;
      });

      setTempSelectedKeys(selecteds);
      setSelectedKeys(selecteds);

      const item: IDropDetailResponse = list?.[0] || {};

      setDropState(item.state);

      const image = {
        uid: 0,
        name: 'image file',
        status: 'done',
        thumbUrl: item?.coverimgurl || '',
        url: item?.coverimgurl || '',
      };

      const video = {
        uid: 0,
        name: 'video file',
        status: 'done',
        // thumbUrl: item?.coverimgurl || '',
        url: item?.videourl || '',
      };

      setBackgroundType(item?.coverimgurl ? 'cover' : 'bgcolor');
      setCoverImage(item?.coverimgurl || '');
      setVideoUrl(item?.videourl || '');

      form.setFieldsValue({
        title: item.title,
        description: item.description,
        website: item.website,
        twitter: item.twitter,
        instagram: item.instagram,
        bgcolor: item?.bgcolor,
        coverimgurl: item?.coverimgurl ? image : null,
        videourl: item?.videourl ? video : null,
        dropdate: moment(item.dropdate * 1000),
      });

      searchAccount(item?.accountaddress).then((res) => {
        setSelectedAccount(res.list[0] || null);
      });

      getAllPoolsByCreatorAddress(item.accountaddress).then((res) => {
        const selectedPools = selecteds.map((selectedKey: number) => {
          return res?.data?.find((pool) => {
            return selectedKey === pool.id;
          });
        });

        setTempSelectedPoolList(selectedPools || []);
        setSelectedPoolList(selectedPools || []);
      });
    }
  }, [currentDropId, dropData, dropDataLoading]);

  const handleEdit = (data: any) => {
    // console.log('data: ', data);

    if (!selectedAccount) return;

    let bgcolor;
    let coverimgurl;
    if (backgroundType === 'bgcolor') {
      bgcolor = data?.bgcolor;
      coverimgurl = '';
    } else {
      bgcolor = '';
      coverimgurl = data?.coverimgurl?.url;
    }

    const params = {
      accountaddress: selectedAccount.accountaddress,
      website: data.website,
      twitter: data.twitter,
      instagram: data.instagram,
      title: data.title,
      description: data.description,
      bgcolor,
      coverimgurl,
      videourl: data.videourl?.url || '',
      poolids: selectedPoolList.map((nft) => {
        return nft.id;
      }),
      ordernum: new Array(selectedPoolList.length).fill(0).map((_, index) => {
        return index;
      }),
      dropdate: data.dropdate.unix(),
    };

    // console.log('params: ', params);

    if (currentDropId) {
      updateOneDrop({ ...params, id: Number(currentDropId) }).then((res) => {
        if (res.code === 1) {
          message.success('Updated Successfully');
          history.push('/drops');
        } else if (res.msg?.includes('timestamp')) message.error('Drop time is over due');
        else message.error('Update failed');
      });
    } else {
      addOneDrop(params).then((res) => {
        if (res.code === 1) {
          message.success('Added Successfully');
          history.push('/drops');
        } else if (res.msg?.includes('timestamp')) message.error('Drop time is over due');
        else message.error('Add failed');
      });
    }
  };

  const handleReset = () => {
    setSelectedPoolList([]);
    setCoverImage('');
    setSelectedAccount(undefined);
    setSelectedKeys([]);
    form.resetFields();
  };

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
    <PageContainer>
      <Card>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={handleEdit}>
          <Form.Item label="Account" required>
            {!currentDropId && (
              <Select
                // open
                loading={accountLoading}
                optionLabelProp={'value'}
                defaultActiveFirstOption={false}
                showSearch
                value={selectedAccount?.accountaddress}
                placeholder="Input Address"
                onSearch={(value) => {
                  if (value) searchAccount(value);
                }}
                onChange={(value) => {
                  setSelectedAccount(
                    accountData?.list?.find((account: IUserItem) => {
                      return account.accountaddress === value;
                    }),
                  );
                }}
                notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              >
                {options}
              </Select>
            )}

            {selectedAccount ? (
              <List
                itemLayout="horizontal"
                dataSource={[selectedAccount]}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <List.Item.Meta
                      avatar={<Image src={item?.imgurl} width={50} height={50} />}
                      title={<span>{item?.username}</span>}
                      description={item?.accountaddress}
                    />
                  </List.Item>
                )}
              />
            ) : null}
          </Form.Item>

          <Form.Item label="Background" required>
            <Space direction="vertical">
              <Select
                style={{ width: 160 }}
                // defaultValue={backgroundType}
                value={backgroundType}
                onSelect={(value: BGType) => {
                  setBackgroundType(value);
                }}
              >
                <Option value="cover">Cover</Option>
                <Option value="bgcolor">Background Color</Option>
              </Select>
              {backgroundType === 'cover' && (
                <>
                  <Form.Item
                    name="coverimgurl"
                    noStyle
                    rules={[{ required: true, message: 'Cover cannot be empty' }]}
                  >
                    <ImageUploader
                      maxCount={1}
                      onChange={(file) => {
                        setCoverImage(file?.thumbUrl || file?.url || '');
                      }}
                      limit={4 * 1024 * 1024}
                    />
                  </Form.Item>
                  <span>Support PNG, JPG, GIF, WEBP, etc. Max size: 4MB.</span>
                </>
              )}
              {backgroundType === 'bgcolor' && (
                <Form.Item
                  name="bgcolor"
                  noStyle
                  rules={[{ required: true, message: 'Background color cannot be empty' }]}
                >
                  <ColorPicker value="#FFF" />
                </Form.Item>
              )}
            </Space>
          </Form.Item>

          {backgroundType === 'cover' && coverImage && (
            <Form.Item label="Image Preview">
              <div className={styles['cover-image']}>
                <div className={styles.preview}>
                  <Image width={240} height={100} src={coverImage} />
                  <span>On PC</span>
                </div>
                <div className={styles.preview}>
                  <Image width={73} height={100} src={coverImage} />
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
            <DatePicker
              disabled={dropState === 2 || dropState === 3}
              inputReadOnly
              format={'YYYY-MM-DD HH:mm'}
              showTime={{ defaultValue: moment().add(1, 'minute') }}
              showNow={false}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
          </Form.Item>
          <Form.Item label="Video">
            <Form.Item name="videourl" noStyle>
              <VideoUploader
                maxCount={1}
                onChange={(file) => {
                  setVideoUrl(file?.url || '');
                }}
                limit={4 * 1024 * 1024}
              />
            </Form.Item>
            <span>Support AVI, rmvb, rm, FLV, mp4, etc. Max size: 30M.</span>
          </Form.Item>

          {videoUrl && (
            <Form.Item label="Video Preview">
              <video height={160} src={videoUrl} controls preload={'metadata'} />
            </Form.Item>
          )}

          <Form.Item label="Links">
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
          <Form.Item
            name="nfts"
            label="NFTs List"
            required
            rules={[
              () => ({
                validator() {
                  if (selectedPoolList.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The NFTs List cannot be empty.'));
                },
              }),
            ]}
          >
            <Space direction="vertical">
              {(!currentDropId || dropState === 1) && (
                <Button
                  onClick={() => {
                    setAddNftModalVisible(true);
                  }}
                >
                  Add
                </Button>
              )}
              <OperateNftTable
                selectedPoolList={selectedPoolList}
                setTempSelectedPoolList={setTempSelectedPoolList}
                setSelectedPoolList={setSelectedPoolList}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                tempSelectedKeys={tempSelectedKeys}
                setTempSelectedKeys={setTempSelectedKeys}
              />
            </Space>
          </Form.Item>
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

        <Modal
          destroyOnClose
          title="Select NFTs"
          width={800}
          bodyStyle={{ padding: 20 }}
          visible={addNftModalVisible}
          onOk={() => {
            setAddNftModalVisible(false);
            setSelectedPoolList(tempSelectedPoolList);
            setSelectedKeys(tempSelectedKeys);
            // setTempSelectedKeys([])
            // setTempSelectedPoolList([])
          }}
          onCancel={() => {
            setAddNftModalVisible(false);
            setTempSelectedPoolList(selectedPoolList);
            setTempSelectedKeys(selectedKeys);
          }}
        >
          <AddNftTable
            // userAddress={selectedAccount?.accountaddress || ''}
            userAddress={selectedAccount?.accountaddress || ''}
            tempSelectedPoolList={tempSelectedPoolList}
            setTempSelectedPoolList={setTempSelectedPoolList}
            tempSelectedKeys={tempSelectedKeys}
            setTempSelectedKeys={setTempSelectedKeys}
            selectedKeys={selectedKeys}
            // setSelectedKeys={setSelectedKeys}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
