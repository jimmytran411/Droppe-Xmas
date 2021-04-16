import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductList } from './ProductList';

export interface WishlistWithProductDetail {
  id: number;
  userid: number;
  products: IProduct[];
}

export const WishList = (wishList: WishlistWithProductDetail) => {
  const { currentCartPrice, currentSaving, productListEmptyCheck } = useCart();
  return (
    <div className="wishlist-container">
      <span className="current-price">
        <p>
          {currentCartPrice >= 0 && `Current Cart: €${currentCartPrice.toFixed(2)}`}{' '}
          {currentSaving > 0 && `You save: €${currentSaving.toFixed(2)}`}
        </p>
      </span>
      <div className="pending-list">
        <h4>Wishlist</h4>
        {!productListEmptyCheck(wishList.products, 'pending') ? (
          <ProductList {...wishList} givenState="pending" />
        ) : (
          'No more gift to show'
        )}
      </div>
      <div className="approved-list">
        <h4>Approve List</h4>
        {!productListEmptyCheck(wishList.products, 'approved') ? (
          <ProductList {...wishList} givenState="approved" />
        ) : (
          `You haven't approved anything yet`
        )}
      </div>
      <div className="discarded-list">
        <h4>Discarded List</h4>
        {!productListEmptyCheck(wishList.products, 'discarded') ? (
          <ProductList {...wishList} givenState="discarded" />
        ) : (
          `You haven't discarded anything yet`
        )}
      </div>
      <Link to="/">
        <button>Done</button>
      </Link>
    </div>
  );
};
