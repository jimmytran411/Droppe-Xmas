import { Product, patchWishlist } from 'api/wishList';
import { Loading, useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ProductWithQuantity, getProductWithQuantity } from 'utils/wishlistAndProduct';
import { WishlistWithProductDetail } from 'WishList';
import Modal from '../Modal';
import { CartItems } from './CartItems';
import './Overview.css';
import { PaymentResult } from './PaymentResult';
import { PendingListCarousel } from './PendingListCarousel';

export const Overview = () => {
  const { wishlists, handlePayment } = useCart();
  const { totalPrice, totalDiscount } = usePrice();

  const [approvedProductList, setApprovedProductList] = useState<ProductWithQuantity[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [pay, setPay] = useState(false);
  const [patchData, setPatchData] = useState<WishlistWithProductDetail[]>([]);

  const history = useHistory();

  const toggleModal = () => setConfirm(!confirm);
  const handlePay = async () => {
    wishlists.forEach(async (wishlist: WishlistWithProductDetail) => {
      const notPedingProduct = wishlist.products.filter(
        (product: Product | Loading) => product !== 'loading' && product.approvalStatus !== 'pending'
      );
      if (notPedingProduct.length) {
        const patchedWishlist: WishlistWithProductDetail = { ...wishlist, products: notPedingProduct };
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
    const approveList = getProductWithQuantity(wishlists, 'approved');
    setApprovedProductList(approveList);
  }, [wishlists]);

  return (
    <div className="overview-container">
      <div className="main">
        <CartItems />
        <PendingListCarousel />
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
            <h6>
              {approvedProductList.length ? 'You have these gifts in your cart:' : `You haven't approved any gifts yet`}
            </h6>
            {approvedProductList &&
              approvedProductList.map(({ id, image, title, quantity, price }: ProductWithQuantity) => {
                return (
                  <div key={id} className="confirmation-product-card">
                    <h5>{title}</h5>
                    <img style={{ width: '50px', height: '50px', borderRadius: '20px' }} src={image} alt={title} />
                    <p>Quantity: {quantity}</p>
                    <p>
                      Total: €{quantity > 1 ? ((price * quantity * (10 - quantity)) / 10).toFixed(2) : price.toFixed(2)}
                    </p>
                    {quantity > 1 && <p>You save: €{((price * quantity * quantity) / 10).toFixed(2)}</p>}
                  </div>
                );
              })}
            {approvedProductList.length && (
              <>
                <div className="total-cost">
                  Total: €<b>{totalPrice >= 0 ? totalPrice.toFixed(2) : '0.00'}</b>
                </div>
                <div className="total-saving">You save: €{totalDiscount.toFixed(2)}</div>
                <button onClick={handlePay}>Pay</button>
                <button onClick={toggleModal}>Cancel</button>
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
              <PaymentResult {...{ patchData, productStatus: 'approved' }} />
            </div>
            {getProductWithQuantity(patchData, 'discarded').length ? (
              <div className="payment-result-discard-list">
                <h5>You have discarded these:</h5>
                {getProductWithQuantity(patchData, 'discarded').map(({ title, image, price, quantity, id }) => {
                  return (
                    <div key={id}>
                      <h6>{title}</h6>
                      <img style={{ width: '50px', height: '50px', borderRadius: '20px' }} src={image} alt={title} />
                      <p>Price: €{price}</p>
                      <p>Quantity: {quantity}</p>
                    </div>
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
