import React, { useEffect, useState } from 'react';

import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import { Link } from 'react-router-dom';
import { ProductList } from './ProductList';
import { productListEmptyCheck } from 'utils/wishlistAndProduct';
import { calculateWishlistPrice } from 'utils/priceCalculation';

export interface WishlistWithProductDetail {
  id: number;
  userid: number;
  products: IProduct[];
}

export const WishList = (wishlist: WishlistWithProductDetail) => {
  const { wishlists } = useCart();
  const [currentCartPrice, setCurrentCartPrice] = useState<number>(0);
  const [currentSaving, setCurrentSaving] = useState<number>(0);

  useEffect(() => {
    const { totalDiscount, priceAfterDiscount } = calculateWishlistPrice(wishlist, wishlists);
    setCurrentCartPrice(priceAfterDiscount);
    setCurrentSaving(totalDiscount);
  }, [wishlist]);
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
        {!productListEmptyCheck(wishlist.products, 'pending') ? (
          <ProductList {...wishlist} givenState="pending" />
        ) : (
          'No more gift to show'
        )}
      </div>
      <div className="approved-list">
        <h4>Approve List</h4>
        {!productListEmptyCheck(wishlist.products, 'approved') ? (
          <ProductList {...wishlist} givenState="approved" />
        ) : (
          `You haven't approved anything yet`
        )}
      </div>
      <div className="discarded-list">
        <h4>Discarded List</h4>
        {!productListEmptyCheck(wishlist.products, 'discarded') ? (
          <ProductList {...wishlist} givenState="discarded" />
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
