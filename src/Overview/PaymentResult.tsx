import { Product } from 'api/wishList';
import { Loading } from 'context/CartContext';
import React from 'react';
import { Loader } from 'utils/Loader';
import { WishlistWithProductDetail } from 'WishList';

export interface PaymentResultProps {
  patchData: WishlistWithProductDetail[];
  productStatus: 'approved' | 'discarded';
}
export const PaymentResult = ({ patchData, productStatus }: PaymentResultProps) => {
  return (
    <>
      {patchData.length ? (
        patchData.map((wishlist) => {
          return (
            <div key={wishlist.id}>
              <h6>Child {wishlist.id}</h6>
              {wishlist.products.map((product: Product | Loading) => {
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
        <Loader />
      )}
    </>
  );
};
