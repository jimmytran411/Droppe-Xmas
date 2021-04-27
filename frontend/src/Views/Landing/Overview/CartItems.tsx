import React, { useState } from 'react';

import { Product } from 'api/wishList';
import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import { Loader } from 'utils/Loader';
import { productListEmptyCheck } from 'utils/wishlistAndProduct';
import { WishlistWithProductDetail } from 'Views/WishList';
import Modal from 'Modal';
import { ApprovalStatus, Loading } from 'common/commonType';

export interface OverviewProductReturn {
  wishlistToUpdate: WishlistWithProductDetail;
  returnedProduct: Product;
}

interface CartItemsProps {
  givenStatus: ApprovalStatus;
}

export const CartItems = ({ givenStatus }: CartItemsProps) => {
  const [returnConfirmation, setReturnConfirmation] = useState(false);
  const [productReturnParam, setProductReturnParam] = useState<OverviewProductReturn>();

  const { totalPrice } = usePrice();
  const { wishlists, handleProduct } = useCart();

  const handleConfirmReturn = () => {
    setReturnConfirmation(false);
    productReturnParam &&
      handleProduct(productReturnParam.returnedProduct, 'pending', productReturnParam.wishlistToUpdate);
  };

  return (
    <div className="overview-list">
      <span className="section-title">Your cart's items:</span>
      {totalPrice > 0
        ? wishlists.map((wishlist: WishlistWithProductDetail) => {
            return (
              <div className="child-approve-list" key={wishlist.id}>
                <span className="cap-title">{`Child ${wishlist.id}:`}</span>
                {productListEmptyCheck(wishlist.products, givenStatus) ? (
                  `You haven't approved any gift for Child ${wishlist.id} yet`
                ) : (
                  <React.Fragment>
                    {wishlist.products.map((product: Product | Loading, index) => {
                      return (
                        <React.Fragment key={index}>
                          {product === 'loading' && <Loader />}
                          {product !== 'loading' && product.approvalStatus === givenStatus && (
                            <div className="overview-product-card" key={product.id}>
                              <div className="opc-image">
                                <div style={{ backgroundImage: `url(${product.image})` }}></div>
                              </div>
                              <div className="opc-product-info">
                                <span className="opc-title">{product.title}</span>
                                <span className="opc-price">€{product.price}</span>
                              </div>
                              <span
                                className="opc-remove-btn"
                                onClick={() => {
                                  setReturnConfirmation(true);
                                  setProductReturnParam({ wishlistToUpdate: wishlist, returnedProduct: product });
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
