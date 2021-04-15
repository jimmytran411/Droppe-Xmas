import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';
import { Product } from './Product';

export interface IProductList extends IWishlistWithProductDetail {
  givenState: 'pending' | 'approved' | 'discarded';
}

export const ProductList = ({ products, givenState, ...rest }: IProductList) => {
  const { handleProduct, totalQuantity } = useCart();
  return (
    <div className="product-list">
      {products &&
        products.map((product: IProduct, index: number) => {
          const quantity = totalQuantity(product) - 1;
          const discountPercent = quantity > 1 && quantity * 10;
          return (
            <div key={index} className="product-card">
              {product.currentState === givenState && (
                <>
                  <Product {...product} />
                  <p className="discount-message">
                    <b>
                      {quantity > 1 &&
                        `Other children want this too. Save up to ${discountPercent}% by choosing this product`}
                    </b>
                  </p>
                  <button
                    aria-label={
                      product.currentState === 'pending' ? `approve-btn-${product.id}` : `return-btn-${product.id}`
                    }
                    onClick={() => {
                      product.currentState === 'pending'
                        ? handleProduct(product, 'approved', { products, ...rest })
                        : handleProduct(product, 'pending', { products, ...rest });
                    }}
                  >
                    {product.currentState === 'pending' ? 'Approve' : 'Return to Wishlist'}
                  </button>
                  <button
                    aria-label={
                      product.currentState === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                    }
                    onClick={() => {
                      product.currentState === 'discarded'
                        ? handleProduct(product, 'approved', { products, ...rest })
                        : handleProduct(product, 'discarded', { products, ...rest });
                    }}
                  >
                    {product.currentState === 'discarded' ? 'Approve' : 'Discard'}
                  </button>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};
