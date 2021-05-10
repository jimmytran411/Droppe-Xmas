import React from 'react';

import { Loader } from 'utils/Loader';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';
import { usePrice } from 'context/PriceContext';

export interface PaymentResultProps {
  patchData: WishlistWithProductStatus[];
  givenStatus: 'approved' | 'discarded';
}
export const PaymentResult: React.FC<PaymentResultProps> = ({ patchData, givenStatus }: PaymentResultProps) => {
  const { getProductFromContext } = useProduct();
  const { getProductPrice } = usePrice();
  return (
    <>
      {patchData.length ? (
        patchData.map(({ wishlistId, productList }) => {
          return (
            <div className="child-approve-list" key={wishlistId}>
              <span className="cap-title">{`Child ${wishlistId}:`}</span>
              {!productList.some(({ approvalStatus }) => approvalStatus === 'approved') ? (
                `You haven't approved any gift for Child ${wishlistId} yet`
              ) : (
                <React.Fragment>
                  {productList.map((product: ProductWithStatus, index) => {
                    const productDetail = getProductFromContext(product.productId);
                    const price = getProductPrice(product.productId);
                    return (
                      <React.Fragment key={index}>
                        {productDetail && product.approvalStatus === givenStatus && (
                          <div className="overview-product-card" key={productDetail.id}>
                            <div className="opc-image">
                              <div style={{ backgroundImage: `url(${productDetail.image})` }}></div>
                            </div>
                            <div className="opc-product-info">
                              <span className="opc-title">{productDetail.title}</span>
                              <span
                                className="opc-price"
                                style={price < productDetail.price ? { textDecoration: 'line-through' } : undefined}
                              >
                                €{productDetail.price}
                              </span>
                              {price < productDetail.price && <span className="opc-price">{price.toFixed(2)}</span>}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              )}
            </div>
          );
        })
      ) : (
        <Loader />
      )}
    </>
  );
};
