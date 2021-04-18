import { Product } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import { Loading, useCart } from 'context/CartContext';
import React from 'react';
import { WishlistWithProductDetail } from 'WishList';
import { ProductCard } from './ProductCard';

export interface ProductListProps {
  givenStatus: ApprovalStatus;
  wishlist: WishlistWithProductDetail;
}

export const ProductList = ({ wishlist, givenStatus }: ProductListProps) => {
  const { wishlists } = useCart();
  return (
    <div className="product-list">
      {wishlist.products &&
        wishlist.products.map((product: Product | Loading, index: number) => {
          return (
            <React.Fragment key={index}>
              {product !== 'loading' && product.approvalStatus === givenStatus && (
                <ProductCard product={product} wishlist={wishlist} />
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
};
