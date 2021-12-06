import ColorPicker from '@/components/ColorPicker';
import MediaUploader from '@/components/MediaUploader';
import { Select } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

type BgType = 'image' | 'color';

export interface IBackground {
  bgType: BgType;
  imgUrl?: string;
  bgColor?: string;
}

export interface IBackgroundInputProps {
  value?: IBackground;
  onChange?: (value: IBackground) => void;
}

const BackgroundInput: React.FC<IBackgroundInputProps> = ({ value, onChange }) => {
  const [bgType, setBgType] = useState<BgType>('image');

  const triggerChange = (changedValue: { bgType?: BgType; imgUrl?: string; bgColor?: string }) => {
    onChange?.({ bgType, ...changedValue });
  };

  const handleBgTypeSelect = (newType: BgType) => {
    setBgType(newType);
    triggerChange({ bgType: newType });
  };

  const handleImgUpload = (newImgUrl: string | undefined) => {
    triggerChange({ imgUrl: newImgUrl, bgColor: '' });
  };

  const handleBgColorSelect = (newColor: string | undefined) => {
    triggerChange({ bgColor: newColor, imgUrl: '' });
  };

  return (
    <div>
      <Select
        style={{ width: 160, marginBottom: 10 }}
        value={value?.bgType || 'image'}
        onSelect={handleBgTypeSelect}
      >
        <Option value="image">Image</Option>
        <Option value="color">Color</Option>
      </Select>

      {value?.bgType === 'image' && (
        <MediaUploader
          value={value?.imgUrl}
          onChange={handleImgUpload}
          sizeLimit={4}
          fileType="image"
        />
      )}

      {value?.bgType === 'color' && <ColorPicker value={value?.bgColor} onChange={handleBgColorSelect} />}
    </div>
  );
};

export { BackgroundInput };
