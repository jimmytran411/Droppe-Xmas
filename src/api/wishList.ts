import axios, { AxiosResponse } from 'axios';

export interface IWishList {
  id: number;
  userId: number;
  date: string;
  products: [IWishListProduct];
}

export interface IWishListProduct {
  productId: number;
  quantity: number;
}

export interface IProduct {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export const getAllWishLists = async () => {
  const wishLists: AxiosResponse<[IWishList]> = await axios.get('https://fakestoreapi.com/carts?limit=5');
  return wishLists;
};

export const getProduct = async (id: number) => {
  const product: AxiosResponse<IProduct> = await axios.get(`https://fakestoreapi.com/products/${id}`);
  return product;
};
