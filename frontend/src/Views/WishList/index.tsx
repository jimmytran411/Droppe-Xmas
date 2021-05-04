import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import './Product.css';
import { useCart } from 'context/CartContext';
import { ProductList } from './ProductList';
import { Navbar } from 'Views/WishList/Navbar';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';
import { getUniqueProductWithGivenStatusAndQuantity } from 'utils/wishlistAndProduct';
import { ProductDetail } from 'api/wishList';
import { SortButton } from './SortButton';

export interface WishlistPriceAndDiscount {
  wishlistPriceAfterDiscount: number;
  wishlistDiscount: number;
  wishlistPrice: number;
}

export const WishList: React.FC<WishlistWithProductStatus> = (wishlist: WishlistWithProductStatus) => {
  const [wishlistPrice, setWishlistPrice] = useState<number>(0);
  const [wishlistDiscount, setWishlistDiscount] = useState<number>(0);
  const [detailList, setDetailList] = useState<ProductDetail[]>([]);

  const { wishlists } = useCart();
  const { getProductFromContext, productDetailList } = useProduct();

  useEffect(() => {
    let wishlistPriceAfterDiscount = 0;
    let wishlistPrice = 0;

    const approvedListWithQuantity = getUniqueProductWithGivenStatusAndQuantity(wishlists, 'approved');

    wishlist.productList.forEach((product: ProductWithStatus) => {
      let discountedPrice = 0;
      if (product.approvalStatus === 'approved') {
        const productDetail = getProductFromContext(product.productId);
        const productPrice = productDetail ? productDetail.price : 0;
        wishlistPrice += productPrice;

        const approvedProduct = _.find(approvedListWithQuantity, ({ productId }) => productId === product.productId);
        const quantityOfApprovedProduct = approvedProduct ? approvedProduct.quantity : 0;

        discountedPrice =
          quantityOfApprovedProduct > 1 ? (productPrice * (10 - quantityOfApprovedProduct)) / 10 : productPrice;
      }
      wishlistPriceAfterDiscount += discountedPrice;
    });
    const wishlistDiscount = wishlistPrice - wishlistPriceAfterDiscount;
    setWishlistPrice(wishlistPriceAfterDiscount);
    setWishlistDiscount(wishlistDiscount);

    // get detail of each product
    wishlist.productList.forEach((product) => {
      const detailProduct = getProductFromContext(product.productId);
      detailProduct && setDetailList((prev) => (!_.find(detailList, detailProduct) ? [...prev, detailProduct] : prev));
    });
  }, [wishlist, productDetailList, wishlists, getProductFromContext, detailList]);

  return (
    <div className="wishlist-container">
      <div className="side">
        <Navbar />
      </div>

      <div className="main">
        <span className="current-price">
          {wishlistPrice >= 0 && `Current Wishlist: €${wishlistPrice.toFixed(2)}`}{' '}
          {wishlistDiscount > 0 && `You save: €${wishlistDiscount.toFixed(2)}`}
        </span>

        {detailList.length === wishlist.productList.length && (
          <SortButton {...{ detailList, wishlistId: wishlist.wishlistId }} />
        )}

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
