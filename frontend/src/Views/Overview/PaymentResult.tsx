import React from 'react';

import { Loader } from 'utils/Loader';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';

export interface PaymentResultProps {
  patchData: WishlistWithProductStatus[];
  productStatus: 'approved' | 'discarded';
}
export const PaymentResult: React.FC<PaymentResultProps> = ({ patchData, productStatus }: PaymentResultProps) => {
  const { getProductFromContext } = useProduct();
  return (
    <>
      {patchData.length ? (
        patchData.map(({ wishlistId, productList }) => {
          return (
            <div key={wishlistId}>
              <h6>Child {wishlistId}</h6>
              {productList.map((product: ProductWithStatus) => {
                const productDetail = getProductFromContext(product.productId);
                return (
                  productDetail &&
                  product.approvalStatus === productStatus && (
                    <div key={productDetail.id} className="confirmation-product-card">
                      <h5>{productDetail.title}</h5>
                      <img
                        style={{ width: '50px', height: '50px', borderRadius: '20px' }}
                        src={productDetail.image}
                        alt={productDetail.title}
                      />
                      <p>Price: €{productDetail.price}</p>
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
