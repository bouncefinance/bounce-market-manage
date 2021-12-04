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
import OperateNftTable from '@/pages/drops/OperateNftTable2';
import type { IPoolResponse } from '@/services/pool/types';
import type { DropsState, IPoolsInfo } from '@/services/drops/types';
import { AccountSelect } from '@/components/AccountSelect';
import { BackgroundInput } from './BackgroundInput';
import FromNowTimePicker from '@/components/FromNowTimePicker';
import VideoUploader2 from '@/components/MediaUploader';
import MediaUploader from '@/components/MediaUploader';

const { Option } = Select;
const { TextArea } = Input;

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

  // eslint-disable-next-line no-template-curly-in-string
  const typeTemplate = 'Please input a valid ${type}';
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    // required: '${label} is required!',
    types: {
      url: typeTemplate,
    },
  };

  // useEffect(() => {
  //   if (!currentDropId) {
  //     setSelectedPoolList([]);
  //     setTempSelectedPoolList([]);
  //   }
  // }, [selectedAccount]);

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

    const selectedPoolIds = dropData?.poolsinfo?.map((pool: IPoolsInfo) => {
      return pool.auctionpoolid;
    });

    setTempSelectedKeys(selectedPoolIds || []);
    setSelectedKeys(selectedPoolIds || []);

    setDropState(dropData.state);

    const video = {
      uid: 0,
      name: 'video file',
      status: 'done',
      // thumbUrl: item?.coverimgurl || '',
      url: dropData.videourl || '',
    };

    setBackgroundType(dropData.coverimgurl ? 'cover' : 'bgcolor');
    setCoverImage(dropData.coverimgurl || '');
    setVideoUrl(dropData.videourl || '');

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

    // getAllPoolsByCreatorAddress(dropData.accountaddress).then((res) => {
    //   if (!selectedPoolIds || !res.data) {
    //     return;
    //   }

    //   const selectedPools = selectedPoolIds
    //     .map((poolId) =>
    //       res.data?.find((pool) => {
    //         return poolId === pool.id;
    //       }),
    //     )
    //     .filter((rawPool) => typeof rawPool !== 'undefined');

    //   // console.log('selectedPools: ', selectedPools);

    //   setTempSelectedPoolList((selectedPools as IPoolResponse[]) || []);
    //   setSelectedPoolList((selectedPools as IPoolResponse[]) || []);
    // });
  }, [currentDropId, dropData, dropDataLoading]);

  const handleEdit = (data: any) => {
    console.log('data: ', data);
    // if (!selectedAccount) return;

    // let bgcolor;
    // let coverimgurl;
    // if (backgroundType === 'bgcolor') {
    //   bgcolor = data?.bgcolor;
    //   coverimgurl = '';
    // } else {
    //   bgcolor = '';
    //   coverimgurl = data?.coverimgurl?.url;
    // }

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

  const handleReset = () => {
    setSelectedPoolList([]);
    setCoverImage('');
    setSelectedAccount(undefined);
    setSelectedKeys([]);
    form.resetFields();
  };

  // const options = accountData?.list?.map((account: IUserItem) => {
  //   return (
  //     <Option key={account.id} value={account.accountaddress} disabled={account.identity === 1}>
  //       <List.Item.Meta
  //         avatar={<Image src={account?.imgurl} width={50} height={50} />}
  //         title={
  //           <Space>
  //             <span>{account?.username}</span>
  //             {account?.identity === 1 ? (
  //               <Tag color="error">Unverfied</Tag>
  //             ) : (
  //               <Tag color="blue">Verfied</Tag>
  //             )}
  //           </Space>
  //         }
  //         description={<span>{account?.accountaddress}</span>}
  //       />
  //     </Option>
  //   );
  // });

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleEdit}
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
            rules={[{ required: true, message: 'Background cannot be empty' }]}
          >
            <BackgroundInput />
          </Form.Item>

          {/* <Form.Item label="Background" required>
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
                  <span>Support jpg, png, gif, jpeg, jp2. Max size: 4MB.</span>
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
 */}
          {/* <Form.Item
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
          </Form.Item> */}

          <Form.Item
            name="dropdate"
            label="Drop Date"
            // TODO: 校验提交的时间是否过期
            rules={[{ required: true, message: 'Drop date cannot be empty' }]}
          >
            <FromNowTimePicker disabled={dropState === 2 || dropState === 3} />
          </Form.Item>

          <Form.Item name="videourl" label="video">
            <MediaUploader sizeLimit={30} />
          </Form.Item>

          {/* <Form.Item label="Video">
            <Form.Item name="videourl" noStyle>
              <VideoUploader
                maxCount={1}
                onChange={(file) => {
                  setVideoUrl(file?.url || '');
                }}
                limit={30 * 1024 * 1024}
              />
            </Form.Item>
            <span>Support mp4. Max size: 30M.</span>
          </Form.Item>

          {videoUrl && (
            <Form.Item label="Video Preview">
              <video height={160} src={videoUrl} controls preload={'metadata'} />
            </Form.Item>
          )}

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
          </Form.Item> */}

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
