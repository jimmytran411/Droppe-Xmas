import { Product } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { countTotalProductQuantity } from 'utils/wishlistAndProduct';
import { WishlistWithProductDetail } from 'WishLists';
import { ProductCard } from './ProductCard';

export interface ProductListProps extends WishlistWithProductDetail {
  givenStatus: 'pending' | 'approved' | 'discarded';
}

export const ProductList = ({ products, givenStatus, id, userid }: ProductListProps) => {
  const { handleProduct, wishlists } = useCart();
  return (
    <div className="product-list">
      {products &&
        products.map((product: Product, index: number) => {
          const quantity = countTotalProductQuantity(product, { products, id, userid }, wishlists);
          const discountPercent = quantity > 1 && quantity * 10;
          return (
            <React.Fragment key={index}>
              {product.approvalStatus === givenStatus && <ProductCard {...product} {...{ products, id, userid }} />}
            </React.Fragment>
          );
        })}
    </div>
  );
};
