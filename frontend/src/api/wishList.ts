import axios, { AxiosResponse } from 'axios';
import { WishlistWithProductStatus } from 'common/commonInterface';

export interface WishList {
  id: number;
  userId: number;
  date: string;
  products: WishListProduct[];
}

export interface WishListProduct {
  productId: number;
  quantity: number;
}

export interface ProductDetail {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export const getWishLists = (): Promise<AxiosResponse<WishList[]>> => {
  return axios.get('/carts?limit=5');
};

export const getWishList = async (id: number): Promise<AxiosResponse<WishList>> => {
  return axios.get(`/carts/${id}`);
};

export const getProductDetail = (id: number): Promise<AxiosResponse<ProductDetail>> => {
  return axios.get<ProductDetail>(`/products/${id}`);
};

export const patchWishlist = async (wishlist: WishlistWithProductStatus) => {
  // const updateData = { ...wishlist, date: new Date().toJSON().slice(0, 10).split('-').reverse().join('/') };
  return await axios.patch(`/carts/${wishlist.wishlistId}`, wishlist);
};
