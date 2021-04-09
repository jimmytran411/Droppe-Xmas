import { IProduct } from 'api/wishList';
import React from 'react';
import { IProductList, ProductList } from './ProductList';

export interface IWishlistWithProductDetail {
  id: number;
  userid: number;
  products: IProduct[][];
}

export const CurrentWishList = ({ products }: IWishlistWithProductDetail) => {
  return (
    <div>
      {products &&
        products.map((product: IProduct[], index: number) => {
          switch (product[0].currentState) {
            case 'pending':
              const pendingProduct: IProductList = { productList: [product[0]], productCurrentState: 'pending' };
              return <ProductList key={index} {...pendingProduct} />;
            case 'approved':
              const approvedProduct: IProductList = { productList: [product[0]], productCurrentState: 'approved' };
              return <ProductList key={index} {...approvedProduct} />;
            case 'discarded':
              const discardedProduct: IProductList = { productList: [product[0]], productCurrentState: 'discarded' };
              return <ProductList key={index} {...discardedProduct} />;
            default:
              return 'Product Not Found';
          }
        })}
    </div>
  );
};
