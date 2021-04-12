import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { ProductList } from './ProductList';

export interface IWishlistWithProductDetail {
  id: number;
  userid: number;
  products: IProduct[];
}

export const CurrentWishList = ({ products }: IWishlistWithProductDetail) => {
  const { currentCartPrice, currentSaving } = useCart();
  return (
    <div className="wishlist-container">
      <span className="current-price">
        <p>
          Current Cart: €{currentCartPrice.toFixed(2)} {currentSaving > 0 && `You save: €${currentSaving.toFixed(2)}`}
        </p>
      </span>
      <div className="pending-list">
        <h4>Wishlist</h4>
        <ProductList {...{ productList: products, givenState: 'pending' }} />
      </div>
      <div className="approved-list">
        <h4>Approve List</h4>
        <ProductList {...{ productList: products, givenState: 'approved' }} />
      </div>
      <div className="discarded-list">
        <h4>Discarded List</h4>
        <ProductList {...{ productList: products, givenState: 'discarded' }} />
      </div>
    </div>
  );
};
