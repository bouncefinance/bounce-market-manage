import React from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, Image, Tag, Tabs, Input, Space, message, Modal, Button, Tooltip } from 'antd';
import { useRequest } from 'umi';
import request from 'umi-request';


const { TabPane } = Tabs;
const { Search } = Input;
const { confirm } = Modal;

const index:React.FC = () => {
    return (
        <PageContainer>
            <h1>History Page</h1>
        </PageContainer>
    )
}

export default index
