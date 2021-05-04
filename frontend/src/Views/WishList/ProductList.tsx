import React from 'react';

import { ApprovalStatus } from 'common/commonType';
import { ProductCard } from './ProductCard';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';

export interface ProductListProps {
  givenStatus: ApprovalStatus;
  wishlist: WishlistWithProductStatus;
}

export const ProductList: React.FC<ProductListProps> = ({ wishlist, givenStatus }: ProductListProps) => {
  return (
    <div className="product-list">
      {wishlist.productList &&
        wishlist.productList.map((product: ProductWithStatus, index: number) => {
          return (
            <React.Fragment key={index}>
              {product.approvalStatus === givenStatus && <ProductCard {...{ wishlist, product }} />}
            </React.Fragment>
          );
        })}
    </div>
  );
};
