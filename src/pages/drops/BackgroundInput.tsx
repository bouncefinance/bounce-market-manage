import AvatarUploader from '@/components/AvatarUploader';
import ColorPicker from '@/components/ColorPicker';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

type BgType = 'image' | 'color';

interface IBackground {
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
  // const [bgValue, setBgValue] = useState<string>();

  useEffect(() => {
    console.log('value: ', value);
    // setBgType(value?.bgType);
    // setBgValue(value?.bgValue || '');
  }, [value]);

  // useEffect(() => {
  //   console.log('bgType: ', bgType);
  // }, [bgType]);

  // useEffect(() => {
  //   console.log('bgValue: ', bgValue);
  // }, [bgValue]);

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
      <Select style={{ width: 160, marginBottom: 10 }} value={bgType} onSelect={handleBgTypeSelect}>
        <Option value="image">Image</Option>
        <Option value="color">Color</Option>
      </Select>

      {bgType === 'image' && (
        <AvatarUploader value={value?.imgUrl} onChange={handleImgUpload} sizeLimit={4} />
      )}

      {bgType === 'color' && <ColorPicker value={value?.bgColor} onChange={handleBgColorSelect} />}
    </div>
  );
};

export { BackgroundInput };
