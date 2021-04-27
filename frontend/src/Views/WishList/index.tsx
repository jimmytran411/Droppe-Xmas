import React, { useEffect, useState } from 'react';

import { useCart } from 'context/CartContext';
import { ProductList } from './ProductList';
import { productListEmptyCheck } from 'utils/wishlistAndProduct';
import { calculateWishlistPrice } from 'utils/priceCalculation';
import { Navbar } from 'Views/WishList/Navbar';
import './Product.css';
import { WishlistWithProductStatus } from 'common/commonInterface';

export const WishList = (wishlist: WishlistWithProductStatus) => {
  const { wishlists } = useCart();
  const [currentWishlistPrice, setCurrentWishlistPrice] = useState<number>(0);
  const [currentDiscount, setCurrentDiscount] = useState<number>(0);

  useEffect(() => {
    const { totalDiscount, priceAfterDiscount } = calculateWishlistPrice(wishlist, wishlists);
    setCurrentWishlistPrice(priceAfterDiscount);
    setCurrentDiscount(totalDiscount);
  }, [wishlist]);
  return (
    <div className="wishlist-container">
      <div className="side">
        <Navbar />
      </div>
      <div className="main">
        <span className="current-price">
          <p>
            {currentWishlistPrice >= 0 && `Current Cart: €${currentWishlistPrice.toFixed(2)}`}{' '}
            {currentDiscount > 0 && `You save: €${currentDiscount.toFixed(2)}`}
          </p>
        </span>
        <div className="pending-list">
          <span className="section-title">Wishlist</span>
          {!productListEmptyCheck(wishlist.productList, 'pending') ? (
            <ProductList wishlist={wishlist} givenStatus="pending" />
          ) : (
            'No more gift to show'
          )}
        </div>
        <div className="approved-list">
          <span className="section-title">Approve List</span>
          {!productListEmptyCheck(wishlist.productList, 'approved') ? (
            <ProductList wishlist={wishlist} givenStatus="approved" />
          ) : (
            `You haven't approved anything yet`
          )}
        </div>
        <div className="discarded-list">
          <span className="section-title">Discarded List</span>
          {!productListEmptyCheck(wishlist.productList, 'discarded') ? (
            <ProductList wishlist={wishlist} givenStatus="discarded" />
          ) : (
            `You haven't discarded anything yet`
          )}
        </div>
      </div>
    </div>
  );
};
