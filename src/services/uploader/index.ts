import { post } from '../index';
import Apis from '../apis';
import { IFileUploadResponse } from './types';

export const fileUploader = (data: any) => {
  return post<IFileUploadResponse>(Apis.fileupload, data);
};
