import axios from 'axios';

export interface IWishList {
  id: number;
  userId: number;
  date: string;
  products: IWishListProduct[];
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
  currentState?: 'pending' | 'approved' | 'discarded';
}

export const getAllWishLists = async () => {
  return axios.get<IWishList[]>('https://fakestoreapi.com/carts?limit=5');
};

export const getProduct = async (id: number) => {
  return await axios.get<IProduct>(`https://fakestoreapi.com/products/${id}`);
};
