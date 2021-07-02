import React from 'react';
import { message, Upload } from 'antd';
// import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.min.css';
import { fileUploader } from '@/services/uploader';

export interface IImageUploaderProps {
  value?: string;
  maxCount?: number;
  limit?: number;
  onChange: (file: UploadFile, items: UploadFile[]) => void;
}
const ImageUploader: React.FC<IImageUploaderProps> = ({
  value,
  onChange,
  limit,
  maxCount = 10,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);

  const handleChange = ({ file, fileList: newFileList }: UploadChangeParam) => {
    setFileList(newFileList);
    if (file.status === 'done') {
      onChange(file, fileList);
    }
  };

  const handleBeforeUpload = async (file: RcFile) => {
    if (limit && file.size > limit) {
      message.error(`Image must smaller than ${limit}`);
      return false;
    }
    console.log(2);
    // setLoading(true);
    const formData = new FormData();
    formData.append('filename', file);
    const res = await fileUploader(formData);
    file.url = res.result?.path;
    // setLoading(false);
    return Promise.resolve();
  };

  return (
    // <ImgCrop rotate>
      <Upload
        maxCount={maxCount}
        listType="picture-card"
        accept="image/*"
        showUploadList={{ showPreviewIcon: false }}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
      >
        {maxCount > fileList.length ? <PlusOutlined /> : null}
      </Upload>
    // </ImgCrop>
  );
};

export default ImageUploader;
