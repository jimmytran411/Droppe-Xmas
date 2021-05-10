import React, { useState } from 'react';

import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import Modal from 'Modal';
import { ApprovalStatus } from 'common/commonType';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';

export interface OverviewProductReturn {
  wishlistToUpdate: WishlistWithProductStatus;
  returnedProduct: ProductWithStatus;
}

interface CartItemsProps {
  givenStatus: ApprovalStatus;
}

export const CartItems: React.FC<CartItemsProps> = ({ givenStatus }: CartItemsProps) => {
  const [returnConfirmation, setReturnConfirmation] = useState(false);
  const [productReturnParam, setProductReturnParam] = useState<OverviewProductReturn>();

  const { totalPrice, getProductPrice } = usePrice();
  const { wishlists, handleProduct } = useCart();
  const { getProductFromContext } = useProduct();

  const handleConfirmReturn = () => {
    setReturnConfirmation(false);
    productReturnParam &&
      handleProduct(productReturnParam.returnedProduct, 'pending', productReturnParam.wishlistToUpdate);
  };

  return (
    <div className="overview-list">
      <span className="section-title">Your cart's items:</span>
      {totalPrice > 0
        ? wishlists.map(({ wishlistId, productList }: WishlistWithProductStatus) => {
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
                              <span
                                className="opc-remove-btn"
                                onClick={() => {
                                  setReturnConfirmation(true);
                                  setProductReturnParam({
                                    wishlistToUpdate: { productList, wishlistId },
                                    returnedProduct: product,
                                  });
                                }}
                              >
                                ❌
                              </span>
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
        : `You haven't approved any gift yet`}
      {returnConfirmation && (
        <Modal>
          <div className="overview-return-confirmation">
            <p>Are you sure you want to return this gift?</p>
            <button
              onClick={() => {
                handleConfirmReturn();
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setReturnConfirmation(false);
              }}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
