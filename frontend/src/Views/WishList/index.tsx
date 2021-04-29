import React, { useEffect, useState } from 'react';

import './Product.css';
import { useCart } from 'context/CartContext';
import { ProductList } from './ProductList';
import { Navbar } from 'Views/WishList/Navbar';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';

export interface WishlistPriceAndDiscount {
  wishlistPriceAfterDiscount: number;
  wishlistDiscount: number;
  wishlistPrice: number;
}

export const WishList = (wishlist: WishlistWithProductStatus) => {
  const [wishlistPrice, setWishlistPrice] = useState<number>(0);
  const [wishlistDiscount, setWishlistDiscount] = useState<number>(0);

  const { wishlists } = useCart();
  const { getProductFromContext } = useProduct();

  const calculateWishlistPrice = (productList: ProductWithStatus[]) => {
    let wishlistPriceAfterDiscount = 0;
    let wishlistPrice = 0;

    productList.forEach((product: ProductWithStatus) => {
      let discount = 0;
      if (product.approvalStatus === 'approved') {
        const currentProductDetail = getProductFromContext(product.productId);
        const currentProductPrice = currentProductDetail ? currentProductDetail.price : 0;
        wishlistPrice += currentProductPrice;

        let approvedProductCount = 0;
        wishlists.forEach((wishlist) =>
          wishlist.productList.forEach(
            ({ approvalStatus, productId }) =>
              approvalStatus === 'approved' && productId === product.productId && approvedProductCount++
          )
        );

        discount =
          approvedProductCount > 1 ? (currentProductPrice * (10 - approvedProductCount)) / 10 : currentProductPrice;
      }
      wishlistPriceAfterDiscount += discount;
    });

    const wishlistDiscount = wishlistPrice - wishlistPriceAfterDiscount;
    const wishlistPriceAndDiscount: WishlistPriceAndDiscount = {
      wishlistPriceAfterDiscount,
      wishlistDiscount,
      wishlistPrice,
    };
    return wishlistPriceAndDiscount;
  };

  useEffect(() => {
    const { wishlistDiscount, wishlistPriceAfterDiscount } = calculateWishlistPrice(wishlist.productList);
    setWishlistPrice(wishlistPriceAfterDiscount);
    setWishlistDiscount(wishlistDiscount);
  }, [wishlist]);
  return (
    <div className="wishlist-container">
      <div className="side">
        <Navbar />
      </div>
      <div className="main">
        <span className="current-price">
          <p>
            {wishlistPrice >= 0 && `Current Wishlist: €${wishlistPrice.toFixed(2)}`}{' '}
            {wishlistDiscount > 0 && `You save: €${wishlistDiscount.toFixed(2)}`}
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
