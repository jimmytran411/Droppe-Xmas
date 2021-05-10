import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { patchWishlist } from 'api/wishList';
import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import { getUniqueProductWithGivenStatusAndQuantity } from 'utils/wishlistAndProduct';
import { CartItems } from './CartItems';
import { PaymentResult } from './PaymentResult';
import { ProductCarousel } from './ProductCarousel';
import Modal from '../../Modal';
import './Overview.css';
import { ProductWithQuantityList, ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';

export const Overview: React.FC = () => {
  const { wishlists, handlePayment } = useCart();
  const { totalPrice, totalDiscount } = usePrice();
  const { getProductFromContext } = useProduct();

  const [approvedProductList, setApprovedProductList] = useState<ProductWithQuantityList[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [pay, setPay] = useState(false);
  const [patchData, setPatchData] = useState<WishlistWithProductStatus[]>([]);

  const history = useHistory();

  const toggleModal = () => setConfirm(!confirm);
  const handlePay = async () => {
    wishlists.forEach(async (wishlist: WishlistWithProductStatus) => {
      const notPedingProduct = wishlist.productList.filter(
        (product: ProductWithStatus) => product.approvalStatus !== 'pending'
      );
      if (notPedingProduct.length) {
        const patchedWishlist: WishlistWithProductStatus = { ...wishlist, productList: notPedingProduct };
        const { data } = await patchWishlist(patchedWishlist);
        setPatchData((prev) => {
          return [...prev, { ...data }];
        });
      }
    });
    setConfirm(!confirm);
    setPay(true);
  };

  const handleAfterPaymentConfirm = () => {
    setPay(false);
    setPatchData([]);
    handlePayment();
    history.push('/');
  };

  useEffect(() => {
    const approveList = getUniqueProductWithGivenStatusAndQuantity(wishlists, 'approved');
    setApprovedProductList(approveList);
  }, [wishlists]);

  return (
    <div className="overview-container">
      <div className="main">
        <CartItems givenStatus="approved" />
        <ProductCarousel givenStatus="pending" />
      </div>

      <div className="side">
        <div className="side-wrapper">
          <h2>Order's overall details</h2>
          <div className="total-cost">
            Total: €<b>{totalPrice.toFixed(2)}</b>
          </div>
          <div className="total-saving">You save: €{totalDiscount.toFixed(2)}</div>
          {totalPrice > 0 && (
            <button
              className="checkout-btn"
              onClick={() => {
                toggleModal();
              }}
            >
              Checkout
            </button>
          )}
        </div>
      </div>

      {confirm && (
        <Modal>
          <div className="payment-overview">
            <span>
              {approvedProductList.length ? 'You have these gifts in your cart:' : `You haven't approved any gifts yet`}
            </span>
            {approvedProductList &&
              approvedProductList.map(({ productId, quantity }: ProductWithQuantityList) => {
                const productDetail = getProductFromContext(productId);
                return (
                  productDetail && (
                    <div key={productDetail.id} className="confirmation-product-card">
                      <p>{productDetail.title}</p>
                      <img
                        style={{ width: '50px', height: '50px', borderRadius: '20px' }}
                        src={productDetail.image}
                        alt={productDetail.title}
                      />
                      <span>Quantity: {quantity}</span>
                      <span>
                        Price: €
                        {quantity > 1
                          ? ((productDetail.price * quantity * (10 - quantity)) / 10).toFixed(2)
                          : productDetail.price.toFixed(2)}
                      </span>
                      {quantity > 1 && (
                        <span>You save: €{((productDetail.price * quantity * quantity) / 10).toFixed(2)}</span>
                      )}
                    </div>
                  )
                );
              })}
            {approvedProductList.length && (
              <>
                <div className="total">
                  <p className="total-cost">
                    Total: €<b>{totalPrice >= 0 ? totalPrice.toFixed(2) : '0.00'}</b>
                  </p>
                  <p className="total-saving">You save: €{totalDiscount.toFixed(2)}</p>
                </div>
                <div className="pay-btn-group">
                  <button className="pay" onClick={handlePay}>
                    Pay
                  </button>
                  <button onClick={toggleModal}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {pay && (
        <Modal>
          <div className="success-payment">
            <div className="payment-result-approved-list">
              <h4>Thank you for your purchase 🙂</h4>
              <h5>You have successfully purchased these gifts:</h5>
              <PaymentResult {...{ patchData, givenStatus: 'approved' }} />
            </div>
            {getUniqueProductWithGivenStatusAndQuantity(patchData, 'discarded').length ? (
              <div className="payment-result-discard-list">
                <h5>You have discarded these:</h5>
                {getUniqueProductWithGivenStatusAndQuantity(patchData, 'discarded').map(({ productId, quantity }) => {
                  const productDetail = getProductFromContext(productId);
                  return (
                    productDetail && (
                      <div key={productDetail.id}>
                        <h6>{productDetail.title}</h6>
                        <img
                          style={{ width: '50px', height: '50px', borderRadius: '20px' }}
                          src={productDetail.image}
                          alt={productDetail.title}
                        />
                        <p>Price: €{productDetail.price}</p>
                        <p>Quantity: {quantity}</p>
                      </div>
                    )
                  );
                })}
              </div>
            ) : (
              ''
            )}
            <button onClick={handleAfterPaymentConfirm}>OK</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
