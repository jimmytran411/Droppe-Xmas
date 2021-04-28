import React, { useEffect, useState } from 'react';

import './Product.css';
import { useCart } from 'context/CartContext';
import { ProductList } from './ProductList';
import { Navbar } from 'Views/WishList/Navbar';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';
import { countTotalProductWithGivenStatus } from 'utils/wishlistAndProduct';

export interface CurrentWishlistPrice {
  discountedTotalPrice: number;
  totalDiscount: number;
  totalPrice: number;
}

export const WishList = (wishlist: WishlistWithProductStatus) => {
  const [currentWishlistPrice, setCurrentWishlistPrice] = useState<number>(0);
  const [currentDiscount, setCurrentDiscount] = useState<number>(0);

  const { wishlists } = useCart();
  const { getProductFromContext } = useProduct();

  const calculateWishlistPrice = (productList: ProductWithStatus[], approvedProductCount: number) => {
    let discountedTotalPrice = 0;
    let totalPrice = 0;

    productList.forEach((product: ProductWithStatus) => {
      let discount = 0;
      if (product.approvalStatus === 'approved') {
        const currentProductDetail = getProductFromContext(product.productId);
        const currentProductPrice = currentProductDetail ? currentProductDetail.price : 0;
        totalPrice += currentProductPrice;

        discount =
          approvedProductCount > 1 ? (currentProductPrice * (10 - approvedProductCount)) / 10 : currentProductPrice;
      }
      discountedTotalPrice += discount;
    });

    let totalDiscount = totalPrice - discountedTotalPrice;
    const currentWishlistPrice: CurrentWishlistPrice = { discountedTotalPrice, totalDiscount, totalPrice };
    return currentWishlistPrice;
  };

  useEffect(() => {
    const { count } = countTotalProductWithGivenStatus(wishlists, 'approved');
    const { totalDiscount, discountedTotalPrice } = calculateWishlistPrice(wishlist.productList, count);
    setCurrentWishlistPrice(discountedTotalPrice);
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
          {wishlist.productList.some(({ approvalStatus }: ProductWithStatus) => approvalStatus === 'pending') ? (
            <ProductList wishlist={wishlist} givenStatus="pending" />
          ) : (
            'No more gift to show'
          )}
        </div>
        <div className="approved-list">
          <span className="section-title">Approve List</span>
          {wishlist.productList.some(({ approvalStatus }: ProductWithStatus) => approvalStatus === 'approved') ? (
            <ProductList wishlist={wishlist} givenStatus="approved" />
          ) : (
            `You haven't approved anything yet`
          )}
        </div>
        <div className="discarded-list">
          <span className="section-title">Discarded List</span>
          {wishlist.productList.some(({ approvalStatus }: ProductWithStatus) => approvalStatus === 'discarded') ? (
            <ProductList wishlist={wishlist} givenStatus="discarded" />
          ) : (
            `You haven't discarded anything yet`
          )}
        </div>
      </div>
    </div>
  );
};
