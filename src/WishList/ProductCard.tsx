import React, { useEffect, useState } from 'react';

import { Product } from 'api/wishList';
import { WishlistWithProductDetail } from 'WishList';
import { useCart } from 'context/CartContext';
import { Loader } from 'utils/Loader';
import { countTotalProductQuantity } from 'utils/wishlistAndProduct';
import { Loading } from 'common/commonType';
import './ProductCard.css';

export interface ProductCardProps {
  product: Product | Loading;
  wishlist: WishlistWithProductDetail;
}

export const ProductCard = ({ product, wishlist }: ProductCardProps) => {
  const [discount, setDiscount] = useState(0);
  const { handleProduct, wishlists } = useCart();
  useEffect(() => {
    const quantity = countTotalProductQuantity(product, wishlist, wishlists);
    const discountPercent = quantity > 1 && quantity * 10;
    discountPercent && setDiscount(discountPercent);
  }, [wishlists]);
  return (
    <>
      {product === 'loading' && <Loader />}
      {product !== 'loading' && (
        <div className="product-card">
          {discount > 0 && <div className={`discount-label discount--${discount}`}></div>}
          <div className="product-card-img">
            <div style={{ backgroundImage: `url(${product.image})` }}></div>
          </div>

          <div className="product-card-content">
            <span className="product-card-title">{product.title}</span>
            <p className="price">€{product.price}</p>
            <div className="product-card-btn">
              <a
                className={product.approvalStatus === 'pending' ? 'primary' : 'secondary'}
                aria-label={
                  product.approvalStatus === 'pending' ? `approve-btn-${product.id}` : `return-btn-${product.id}`
                }
                onClick={() => {
                  product.approvalStatus === 'pending'
                    ? handleProduct(product, 'approved', wishlist)
                    : handleProduct(product, 'pending', wishlist);
                }}
              >
                {product.approvalStatus === 'pending' ? 'Add to cart' : 'Save to wishlist'}
              </a>
              <a
                className={product.approvalStatus === 'discarded' ? 'primary' : 'secondary'}
                aria-label={
                  product.approvalStatus === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                }
                onClick={() => {
                  product.approvalStatus === 'discarded'
                    ? handleProduct(product, 'approved', wishlist)
                    : handleProduct(product, 'discarded', wishlist);
                }}
              >
                {product.approvalStatus === 'discarded' ? 'Add to cart' : 'Remove'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
