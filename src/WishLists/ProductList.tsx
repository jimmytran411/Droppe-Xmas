import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { Product } from './Product';

export interface IProductList {
  productList: IProduct[];
  productCurrentState: 'pending' | 'approved' | 'discarded';
}

export const ProductList = ({ productList, productCurrentState }: IProductList) => {
  const { approve, pending, discard } = useCart();
  const handleApprove = (product: IProduct) => {
    approve(product);
  };
  const handleDiscard = (product: IProduct) => {
    console.log(product);
  };

  const handleReturn = (product: IProduct) => {};
  return (
    <div className="wishlist">
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
                      productCurrentState === 'pending' ? handleApprove(product) : handleReturn(product);
                    }}
                  >
                    {productCurrentState === 'pending' ? 'Approve' : 'Return to Wishlist'}
                  </button>
                  <button
                    aria-label={
                      productCurrentState === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                    }
                    onClick={() => {
                      productCurrentState === 'discarded' ? handleApprove(product) : handleDiscard(product);
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
