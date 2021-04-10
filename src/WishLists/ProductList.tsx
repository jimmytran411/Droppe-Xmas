import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { Product } from './Product';

export interface IProductList {
  productList: IProduct[];
  productCurrentState: 'pending' | 'approved' | 'discarded';
}

export const ProductList = ({ productList, productCurrentState }: IProductList) => {
  const { handleProduct } = useCart();
  return (
    <div className="product-list">
      {productList &&
        productList.map((product: IProduct, index: number) => {
          return (
            <div key={index} className="product-card">
              {product.currentState === productCurrentState && (
                <div>
                  <Product {...product} />
                  <button
                    aria-label={
                      productCurrentState === 'pending' ? `approve-btn-${product.id}` : `return-btn-${product.id}`
                    }
                    onClick={() => {
                      productCurrentState === 'pending'
                        ? handleProduct(product, 'approved')
                        : handleProduct(product, 'pending');
                    }}
                  >
                    {productCurrentState === 'pending' ? 'Approve' : 'Return to Wishlist'}
                  </button>
                  <button
                    aria-label={
                      productCurrentState === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                    }
                    onClick={() => {
                      productCurrentState === 'discarded'
                        ? handleProduct(product, 'approved')
                        : handleProduct(product, 'discarded');
                    }}
                  >
                    {productCurrentState === 'discarded' ? 'Approve' : 'Discard'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
