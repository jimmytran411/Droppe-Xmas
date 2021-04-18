import { Product } from 'api/wishList';
import React from 'react';
import { WishlistWithProductDetail } from 'WishList';

export interface IPaymentResult {
  patchData: WishlistWithProductDetail[];
  productStatus: 'approved' | 'discarded';
}
export const PaymentResult = ({ patchData, productStatus }: IPaymentResult) => {
  return (
    <>
      {patchData.length ? (
        patchData.map((wishlist) => {
          return (
            <div key={wishlist.id}>
              <h6>Child {wishlist.id}</h6>
              {wishlist.products.map((product: Product | 'loading') => {
                return (
                  product !== 'loading' &&
                  product.approvalStatus === productStatus && (
                    <div key={product.id} className="confirmation-product-card">
                      <h5>{product.title}</h5>
                      <img
                        style={{ width: '50px', height: '50px', borderRadius: '20px' }}
                        src={product.image}
                        alt={product.title}
                      />
                      <p>Price: €{product.price}</p>
                    </div>
                  )
                );
              })}
            </div>
          );
        })
      ) : (
        <div className="loading-animation">Loading ....</div>
      )}
    </>
  );
};
