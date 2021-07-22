import { Apis, post } from '..';
import type { NftDisplayState } from './types';

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
  actionType,
}: {
  contractaddress: string;
  tokenid: number;
  actionType: NftDisplayState;
}) => {
  return post(Apis.updatepoolitem, {
    data: {
      contractaddress,
      tokenid,
      actionType,
    },
  });
};
