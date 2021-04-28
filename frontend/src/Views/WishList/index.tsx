import React, { useEffect, useState } from 'react';

import './Product.css';
import { useCart } from 'context/CartContext';
import { ProductList } from './ProductList';
import { Navbar } from 'Views/WishList/Navbar';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';

export interface DiscountCheck {
  discountCheckedPrice: number;
  quantity: number;
}

export interface CurrentWishlistPrice {
  priceAfterDiscount: number;
  totalDiscount: number;
  totalPrice: number;
}

export const WishList = (wishlist: WishlistWithProductStatus) => {
  const [currentWishlistPrice, setCurrentWishlistPrice] = useState<number>(0);
  const [currentDiscount, setCurrentDiscount] = useState<number>(0);
  const { wishlists } = useCart();
  const { getProductFromContext } = useProduct();

  const discountCheck = (
    wishlists: WishlistWithProductStatus[],
    currentProduct: ProductWithStatus,
    currentWishlistId: number
  ) => {
    let quantity: number = 1;

    wishlists.forEach((wishlist: WishlistWithProductStatus) => {
      wishlist.productList.forEach((product: ProductWithStatus) => {
        if (
          product.approvalStatus === 'approved' &&
          product.productId === currentProduct.productId &&
          wishlist.wishlistId !== currentWishlistId
        ) {
          quantity += 1;
        }
      });
    });

    const currentProductDetail = getProductFromContext(currentProduct.productId);
    const currentProductPrice = currentProductDetail ? currentProductDetail.price : 0;
    const discountedPrice = quantity > 1 ? (currentProductPrice * (10 - quantity)) / 10 : currentProductPrice;

    const discountCheck: DiscountCheck = {
      discountCheckedPrice: discountedPrice,
      quantity,
    };
    return discountCheck;
  };

  const calculateWishlistPrice = (wishlist: WishlistWithProductStatus, wishlists: WishlistWithProductStatus[]) => {
    let priceAfterDiscount = 0;
    let totalPrice = 0;

    if (wishlist.productList && wishlist.productList.length) {
      wishlist.productList.forEach((product: ProductWithStatus) => {
        let discount = 0;
        if (product.approvalStatus === 'approved') {
          const currentProductDetail = getProductFromContext(product.productId);
          const currentProductPrice = currentProductDetail ? currentProductDetail.price : 0;

          totalPrice += currentProductPrice;
          discount = discountCheck(wishlists, product, wishlist.wishlistId).discountCheckedPrice;
        }
        priceAfterDiscount += discount;
      });
    }
    let totalDiscount = totalPrice - priceAfterDiscount;
    const currentWishlistPrice: CurrentWishlistPrice = { priceAfterDiscount, totalDiscount, totalPrice };
    return currentWishlistPrice;
  };
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
