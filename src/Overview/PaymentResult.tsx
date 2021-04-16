import React from 'react';
import { WishlistWithProductDetail } from 'WishLists';

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
              {wishlist.products.map(({ id, image, title, approvalStatus, price }) => {
                return (
                  approvalStatus === productStatus && (
                    <div key={id} className="confirmation-product-card">
                      <h5>{title}</h5>
                      <img style={{ width: '50px', height: '50px', borderRadius: '20px' }} src={image} alt={title} />
                      <p>Original Price: €{price}</p>
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
