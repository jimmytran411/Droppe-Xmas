import axios, { AxiosResponse } from 'axios';
import { ApprovalStatus } from 'common/commonType';
import { WishlistWithProductDetail } from 'WishList';

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

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  approvalStatus: ApprovalStatus;
}

export const getWishLists = async (): Promise<AxiosResponse<WishList[]>> => {
  return axios.get('https://fakestoreapi.com/carts?limit=5');
};

export const getWishList = async (id: number): Promise<AxiosResponse<WishList>> => {
  return axios.get(`https://fakestoreapi.com/carts/${id}`);
};

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await axios.get<Product>(`https://fakestoreapi.com/products/${id}`);
  const productWithPendingState: Product = { ...data, approvalStatus: 'pending' };
  return productWithPendingState;
};

export const patchWishlist = async (wishlist: WishlistWithProductDetail) => {
  // const updateData = { ...wishlist, date: new Date().toJSON().slice(0, 10).split('-').reverse().join('/') };
  return await axios.patch(`https://fakestoreapi.com/carts/${wishlist.id}`, wishlist);
};
