import Web3 from 'web3';
import BounceERC721WithSign from '@/tools/web3/abi/BounceERC721WithSign.json';
import BounceERC1155WithSign from '@/tools/web3/abi/BounceERC1155WithSign.json';

export const web3Provide = Web3.givenProvider;
const web3 = new Web3(web3Provide);

export function getContract(abi: any, address: string) {
  return new web3.eth.Contract(abi, address);
}

/* let BounceERC721WithSign_CT = getContract(
  BounceERC721WithSign.abi,
  tokenContractAddr,
);

let BounceERC1155WithSign_CT = getContract(
  BounceERC1155WithSign.abi,
  tokenContractAddr,
); */

export const getNftBalance = async (
  tokenContractAddr: string,
  tokenId: string,
  account: string,
) => {
  try {
    const BounceERC1155WithSign_CT = getContract(
      BounceERC1155WithSign.abi,
      tokenContractAddr,
    );
    const balance = await BounceERC1155WithSign_CT.methods
      .balanceOf(account, parseInt(tokenId))
      .call();
    return balance;
  } catch (error) {
    console.log('getNftBalance error: ', error);
  }
};
