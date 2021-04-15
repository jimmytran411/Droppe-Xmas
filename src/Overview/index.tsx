import { IProduct, patchWishlist } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React, { useEffect, useState } from 'react';
import { IProductWithQuantity, productWithQuantity } from 'utils/wishlistAndProduct';
import { IWishlistWithProductDetail } from 'WishLists';
import { Product } from 'WishLists/Product';
import Modal from '../Modal';
import './Overview.css';
import { PaymentResult } from './PaymentResult';

export interface IOverviewProductReturn {
  wishlistToUpdate: IWishlistWithProductDetail;
  returnedProduct: IProduct;
}

export const Overview = () => {
  const { totalPrice, totalDiscount, allwishlist, productListEmptyCheck, handlePayment, handleProduct } = useCart();
  const [approvedProductList, setApprovedProductList] = useState<IProductWithQuantity[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [pay, setPay] = useState(false);
  const [returnConfirmation, setReturnConfirmation] = useState(false);
  const [productReturnParam, setProductReturnParam] = useState<IOverviewProductReturn>();
  const [patchData, setPatchData] = useState<IWishlistWithProductDetail[]>([]);

  const wishlistEmptyCheck = (
    wishListsToCheck: IWishlistWithProductDetail[],
    givenState: 'pending' | 'approved' | 'discarded'
  ) => {
    const allWLCheck = wishListsToCheck.map(({ products }: IWishlistWithProductDetail) => {
      return products.filter((product: IProduct) => product.currentState === givenState);
    });
    return allWLCheck.some((a) => {
      return a.length;
    })
      ? false
      : true;
  };

  const toggleModal = () => setConfirm(!confirm);
  const handlePay = async () => {
    allwishlist.forEach(async (wishlist: IWishlistWithProductDetail) => {
      const notPedingProduct = wishlist.products.filter((product: IProduct) => product.currentState !== 'pending');
      if (notPedingProduct.length) {
        const patchedWishlist: IWishlistWithProductDetail = { ...wishlist, products: notPedingProduct };
        const { data } = await patchWishlist(patchedWishlist);
        setPatchData((prev) => {
          return [...prev, { ...data }];
        });
      }
    });
    setConfirm(!confirm);
    setPay(true);
  };
  const handleConfirmReturn = () => {
    setReturnConfirmation(false);
    productReturnParam &&
      handleProduct(productReturnParam.returnedProduct, 'pending', productReturnParam.wishlistToUpdate);
  };

  useEffect(() => {
    const approveList = productWithQuantity(allwishlist, 'approved');
    setApprovedProductList(approveList);
  }, [allwishlist]);

  return (
    <div className="overview-container">
      <div className="overview-approve-list">
        {totalPrice > 0
          ? allwishlist.map((wishlist: IWishlistWithProductDetail) => {
              return (
                <div className="child-approve-list" key={wishlist.id}>
                  <h5>{`Child ${wishlist.id}:`}</h5>
                  {productListEmptyCheck(wishlist.products, 'approved') ? (
                    `You haven't approved any gift for Child ${wishlist.id} yet`
                  ) : (
                    <React.Fragment>
                      {wishlist.products.map((product: IProduct) => {
                        return (
                          product.currentState === 'approved' && (
                            <div className="overview-product-card" key={product.id}>
                              <Product {...product} />
                              <button
                                onClick={() => {
                                  setReturnConfirmation(true);
                                  setProductReturnParam({ wishlistToUpdate: wishlist, returnedProduct: product });
                                }}
                              >
                                ⃔
                              </button>
                            </div>
                          )
                        );
                      })}
                    </React.Fragment>
                  )}
                </div>
              );
            })
          : `You haven't approved any gift yet`}
      </div>
      <div className="total-cost">
        Total: €<b>{totalPrice.toFixed(2)}</b>
      </div>
      <div className="total-saving">You save: €{totalDiscount.toFixed(2)}</div>
      {totalPrice > 0 && (
        <button
          onClick={() => {
            toggleModal();
          }}
        >
          Proceed to Checkout
        </button>
      )}
      {totalPrice > 0 && (
        <>
          {!wishlistEmptyCheck(allwishlist, 'pending') && (
            <div className="overview-pending-list">
              <h5>These items are still in your wishlists:</h5>
              {allwishlist.map((wishlist: IWishlistWithProductDetail, index: number) => {
                return (
                  <div className="child-pending-list" key={index}>
                    <p>Child {wishlist.id}</p>
                    {wishlist.products.map((product: IProduct) => {
                      return product.currentState === 'pending' && <Product key={product.id} {...product} />;
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {confirm && (
        <Modal>
          <div className="payment-overview">
            <h6>
              {approvedProductList.length ? 'You have these gifts in your cart:' : `You haven't approved any gifts yet`}
            </h6>
            {approvedProductList &&
              approvedProductList.map(({ id, image, title, quantity, price }: IProductWithQuantity) => {
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
              <h5>You have successfully purchased these gifts:</h5>
              <PaymentResult {...{ patchData, productState: 'approved' }} />
              <div className="total-cost">
                Total: €<b>{totalPrice >= 0 ? totalPrice.toFixed(2) : '0.00'}</b>
              </div>
              <div className="total-saving">You save: €{totalDiscount.toFixed(2)}</div>
            </div>
            {productWithQuantity(patchData, 'discarded').length ? (
              <div className="payment-result-discard-list">
                <h5>You have discarded these:</h5>
                <PaymentResult {...{ patchData, productState: 'discarded' }} />
              </div>
            ) : (
              ''
            )}
            <button
              onClick={() => {
                setPay(false);
                setPatchData([]);
                handlePayment();
              }}
            >
              OK
            </button>
          </div>
        </Modal>
      )}
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
