import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Form,
  Input,
  Image,
  DatePicker,
  Modal,
  message,
  Menu,
  Table,
  Space,
  Tooltip,
  Dropdown,
  List,
} from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { useState } from 'react';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';
import { IAddDropParams, IAccountsResponse, INftResponse } from '@/services/drops/types';
import { addOneDrop, getAccountByAddress, getonedropsdetail } from '@/services/drops';
import { useRequest, history } from 'umi';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';

import AddNftTable from '@/pages/drops/AddNftTable';
import OperateNftTable from '@/pages/drops/OperateNftTable';

import placeholderImg from '@/assets/images/placeholderImg.svg';
import { ImgErrorUrl } from '@/tools/const';

const { Column } = Table;
const { Search } = Input;

// console.log('history.location.query: ', history.location.query?.id);
const targetDropId = history.location.query?.id;

function range(start: any, end: any) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const disabledDate = (currentDate: any) => currentDate && currentDate < moment().subtract(1, 'day');
const disabledTime = () => {
  const hours = moment().hours();
  const minutes = moment().minutes();
  const seconds = moment().seconds();
  // 当日只能选择当前时间之后的时间点
  return {
    disabledHours: () => range(0, 24).splice(0, hours),
    disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
    disabledSeconds: () => range(0, 60).splice(0, seconds + 1),
  };
};

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<IAccountsResponse>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addNftModalVisible, setAddNftModalVisible] = useState(false);
  const [tempSelectedKeys, setTempSelectedKeys] = useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [tempSelectedNftList, setTempSelectedNftList] = useState<INftResponse[]>([]);
  const [selectedNftList, setSelectedNftList] = useState<INftResponse[]>([]);

  useEffect(() => {
    console.log('tempSelectedKeys: ', tempSelectedKeys);
  }, [tempSelectedKeys]);

  useEffect(() => {
    console.log('selectedKeys: ', selectedKeys);
  }, [selectedKeys]);

  // useEffect(() => {
  //   console.log("tempSelectedNftList: ", tempSelectedNftList)
  // }, [tempSelectedNftList])

  // useEffect(() => {
  //   console.log("selectedNftList: ", selectedNftList)
  // }, [selectedNftList])

  useEffect(() => {
    setSelectedNftList([]);
  }, [selectedAccount]);

  // getAccountByAddress
  const { tableProps: accountTableProps, run: searchAccount } = useRequest(
    ({ pageSize: limit, current: offset }, accountaddress) => {
      return getAccountByAddress({
        offset: (offset - 1) * limit,
        limit,
        accountaddress,
      });
    },
    {
      manual: true,
      paginated: true,
      cacheKey: 'accounts',
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  // getonedropsdetail = ({ offset, limit, dropsid, poolstate }: IGetDropDetailParams) => {
  //   return post<IDropDetailResponse[]>(Apis.getonedropsdetail, {
  //     offset,
  //     limit,
  //     dropsid,
  //     poolstate,
  //   });
  // };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedAccount({ ...selectedRows[0] });
      setDropdownVisible(false);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
    },
    getCheckboxProps: (record: IAccountsResponse) => ({
      disabled: record.identity === 1,
    }),
  };

  const menuEl = useRef(null);
  const formRef = useRef<FormInstance>(null);

  const menu = (
    <Menu ref={menuEl}>
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        rowKey="id"
        {...accountTableProps}
        size="small"
        style={{ width: 500 }}
      >
        <Column
          title="Avatar"
          dataIndex="imgurl"
          key="imgurl"
          width={110}
          align={'center'}
          render={(imgurl) => (
            <Image
              preview={false}
              src={imgurl}
              width={64}
              height={64}
              style={{ objectFit: 'contain' }}
              fallback={ImgErrorUrl}
            />
          )}
        />

        <Column
          title="User name"
          dataIndex="username"
          key="username"
          align={'center'}
          ellipsis={{ showTitle: false }}
          render={(username) =>
            username ? (
              <Tooltip placement="topLeft" title={username}>
                <span>{username}</span>
              </Tooltip>
            ) : (
              '--'
            )
          }
        />

        <Column
          title="Address"
          dataIndex="accountaddress"
          key="accountaddress"
          width={120}
          align={'center'}
          render={(accountaddress) => (
            <Tooltip placement="topLeft" title={accountaddress}>
              <span>{`${accountaddress.slice(0, 6)}...${accountaddress.slice(-4)}`}</span>
            </Tooltip>
          )}
        />
      </Table>
    </Menu>
  );

  const handleEdit = (data: any) => {
    console.log('data.dropdate.unix()', data.dropdate.unix());
    if (!selectedAccount) return;
    const params: IAddDropParams = {
      accountaddress: selectedAccount.accountaddress,
      website: data.website,
      twitter: data.twitter,
      Instagram: data.instagram,
      title: data.title,
      description: data.description,
      bgcolor: data.bgcolor,
      coverimgurl: data.cover?.url,
      poolids: selectedNftList.map((nft) => {
        return nft.id;
      }),
      ordernum: new Array(selectedNftList.length).fill(0).map((_, index) => {
        return index;
      }),
      dropdate: data.dropdate.unix(),
    };

    addOneDrop(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
      } else message.error('Add failed');
    });

    history.push('/drops');
  };

  const [form] = Form.useForm();

  const handleReset = () => {
    setSelectedNftList([]);
    setCoverImage(null);
    setSelectedAccount(undefined);
    setSelectedKeys([]);
    form.resetFields();
    // formRef.current!.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          /* ref={formRef} */ labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleEdit}
        >
          <Form.Item label="Account">
            {!targetDropId && (
              <>
                <Input.Group compact>
                  <Search
                    placeholder={'Input Address'}
                    allowClear
                    enterButton
                    style={{ width: '82%' }}
                    onSearch={(value) => {
                      if (value === '') {
                        setDropdownVisible(false);
                        return;
                      }
                      searchAccount({ current: 1, pageSize: 5 }, value);
                      setDropdownVisible(true);
                    }}
                    // onBlur={() => {setDropdownVisible(false);}}
                  />
                </Input.Group>
                <Dropdown visible={dropdownVisible} overlay={menu}>
                  <span></span>
                </Dropdown>
              </>
            )}
            {selectedAccount ? (
              <List
                itemLayout="horizontal"
                dataSource={[selectedAccount]}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <List.Item.Meta
                      avatar={<Image src={item?.imgurl} width={50} fallback={placeholderImg} />}
                      title={<span>{item?.username}</span>}
                      description={item?.accountaddress}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <></>
            )}
          </Form.Item>
          <Form.Item
            name="cover"
            label="Cover"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue('bgcolor')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The Cover and Background Color cannot both be remote.'),
                  );
                },
              }),
            ]}
          >
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
          <Form.Item
            name="bgcolor"
            label="Background Color"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue('cover')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The Cover and Background Color cannot both be remote.'),
                  );
                },
              }),
            ]}
          >
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
            <DatePicker
              format={'YYYY-MM-DD HH:mm'}
              showTime
              showNow={false}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
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
          <Form.Item
            // name="nfts"
            label="Drop NFTs List"
            rules={[
              () => ({
                validator(_, value) {
                  console.log(selectedNftList)
                  // if (selectedNftList) {
                  //   return Promise.resolve();
                  // }
                  return Promise.reject(new Error('The Drop NFTs List cannot be empty.'));
                },
              }),
            ]}
          >
            <Space direction="vertical">
              <Button
                onClick={() => {
                  setAddNftModalVisible(true);
                }}
              >
                Add
              </Button>
              <OperateNftTable
                selectedNftList={selectedNftList}
                setTempSelectedNftList={setTempSelectedNftList}
                setSelectedNftList={setSelectedNftList}
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
              Create
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
            setSelectedNftList(tempSelectedNftList);
            setSelectedKeys(tempSelectedKeys);
            // setTempSelectedKeys([])
            // setTempSelectedNftList([])
          }}
          onCancel={() => {
            setAddNftModalVisible(false);
            setTempSelectedNftList(selectedNftList);
            setTempSelectedKeys(selectedKeys);
          }}
        >
          <AddNftTable
            userAddress={selectedAccount?.accountaddress || ''}
            tempSelectedNftList={tempSelectedNftList}
            setTempSelectedNftList={setTempSelectedNftList}
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
