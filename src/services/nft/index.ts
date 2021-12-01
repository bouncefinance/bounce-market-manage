import { Apis, post } from '..';
import type { NftDisplayEnum } from './types';

export const deleteNft = ({
  contractaddress,
  tokenid,
}: {
  contractaddress: string;
  tokenid: number;
}) => {
  return post(Apis.delpoolitem, {
    contractaddress,
    tokenid,
  });
};

export const hideNft = ({
  contractaddress,
  tokenid,
  status,
}: {
  contractaddress: string;
  tokenid: number;
  status: NftDisplayEnum;
}) => {
  return post(Apis.updatepoolitem, {
    contractaddress,
    tokenid,
    status,
  });
};
