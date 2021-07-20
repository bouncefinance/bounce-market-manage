import { RECOMMEND_BRANDS_AMOUNT } from '@/tools/const';
import { Apis, post, ToOffset } from '../index';
import type {
  IBrandRequest,
  IBrandResponse,
  IUpdateBrandWeightParams,
  BrandFilterType,
} from './types';
import { BrandFilterEnum } from './types';

export const getRecommendBrands = () => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, {
    offset: 0,
    limit: RECOMMEND_BRANDS_AMOUNT,
  });
};

export const deleteBrand = ({ id }: { id: number }) => {
  return post(Apis.delbrand, { id });
};

export const updateBrandWeight = ({ id, popularweight }: IUpdateBrandWeightParams) => {
  return post<IBrandResponse[]>(Apis.updatbrandeweight, { id, popularweight });
};

export const getBrandsListByFilter = (
  filterType: BrandFilterType,
  searchText: string = '',
  offset: number,
  limit: number = 5,
) => {
  let filter;
  let data;
  switch (filterType) {
    case BrandFilterEnum.likestr:
      filter = 1;
      data = {
        filter,
        likestr: searchText,
        limit,
        offset,
      };
      break;

    case BrandFilterEnum.creator:
      filter = 2;
      data = {
        filter,
        creator: searchText,
        limit,
        offset,
      };
      break;

    case BrandFilterEnum.brandid:
      filter = 3;
      data = {
        filter,
        brandid: Number(searchText),
        limit,
        offset,
      };
      break;

    default:
      filter = 1;
      data = {
        filter,
        likestr: searchText,
        limit,
        offset,
      };
      break;
  }

  return post<IBrandResponse[]>(Apis.getbrandsbylikename, data);
};

export const getBrandsListByName = ({ likestr, offset, limit }: IBrandRequest) => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, {
    filter: 1,
    likestr,
    limit,
    offset,
  });
};

export const getBrandsListByCreator = ({ likestr, offset, limit }: IBrandRequest) => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, {
    filter: 3,
    likestr,
    limit,
    offset,
  });
};

export const getBrandsListById = ({ likestr, offset, limit }: IBrandRequest) => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, {
    filter: 3,
    likestr: Number(likestr),
    limit,
    offset,
  });
};

export const getTopBrands = (limit: number) => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, { offset: 0, limit });
};

export const getAllBrands = () => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, {});
};

export const getBrandsByPage = ({ offset = 1, limit = 10 }: IBrandRequest) => {
  return post<IBrandResponse[]>(Apis.getbrandsbylikename, {
    offset: ToOffset(offset, limit!),
    limit,
  });
};
