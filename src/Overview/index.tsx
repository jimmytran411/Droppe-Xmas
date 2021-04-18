import { Product, patchWishlist } from 'api/wishList';
import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Loader } from 'utils/Loader';
import { ProductWithQuantity, productListEmptyCheck, getProductWithQuantity } from 'utils/wishlistAndProduct';
import { WishlistWithProductDetail } from 'WishList';
import { ProductCard } from 'WishList/ProductCard';
import Modal from '../Modal';
import './Overview.css';
import { PaymentResult } from './PaymentResult';

export interface IOverviewProductReturn {
  wishlistToUpdate: WishlistWithProductDetail;
  returnedProduct: Product;
}

export const Overview = () => {
  const { wishlists, handlePayment, handleProduct } = useCart();
  const { totalPrice, totalDiscount } = usePrice();

  const [approvedProductList, setApprovedProductList] = useState<ProductWithQuantity[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [pay, setPay] = useState(false);
  const [returnConfirmation, setReturnConfirmation] = useState(false);
  const [productReturnParam, setProductReturnParam] = useState<IOverviewProductReturn>();
  const [patchData, setPatchData] = useState<WishlistWithProductDetail[]>([]);
  let [carouselTranslateXValue, setCarouselTranslateXValue] = useState(0);

  const history = useHistory();

  const wishlistEmptyCheck = (
    wishListsToCheck: WishlistWithProductDetail[],
    givenState: 'pending' | 'approved' | 'discarded'
  ) => {
    const checkedWishlists = wishListsToCheck.map(({ products }: WishlistWithProductDetail) => {
      return products.filter(
        (product: Product | 'loading') => product !== 'loading' && product.approvalStatus === givenState
      );
    });
    return checkedWishlists.some((a) => {
      return a.length;
    })
      ? false
      : true;
  };

  const toggleModal = () => setConfirm(!confirm);
  const handlePay = async () => {
    wishlists.forEach(async (wishlist: WishlistWithProductDetail) => {
      const notPedingProduct = wishlist.products.filter(
        (product: Product | 'loading') => product !== 'loading' && product.approvalStatus !== 'pending'
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
  const handleConfirmReturn = () => {
    setReturnConfirmation(false);
    productReturnParam &&
      handleProduct(productReturnParam.returnedProduct, 'pending', productReturnParam.wishlistToUpdate);
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

  const divRef = useRef<HTMLDivElement>(null);
  const slideCarousel = (direction: string) => {
    const a = divRef.current?.scrollWidth || 0;
    const b = divRef.current?.offsetWidth || 0;
    const increase = b / 2;

    if (direction === 'next') {
      carouselTranslateXValue = carouselTranslateXValue - increase;
    }
    if (direction === 'prev') {
      carouselTranslateXValue = carouselTranslateXValue + increase;
    }
    if (carouselTranslateXValue < b - a) {
      carouselTranslateXValue = b - a;
    }
    if (carouselTranslateXValue > 0) {
      carouselTranslateXValue = 0;
    }

    setCarouselTranslateXValue(carouselTranslateXValue);
  };

  return (
    <div className="content-wrapper">
      <div className="overview-container">
        <div className="main">
          <div className="overview-list">
            <span className="section-title">Your cart's items:</span>
            {totalPrice > 0
              ? wishlists.map((wishlist: WishlistWithProductDetail) => {
                  return (
                    <div className="child-approve-list" key={wishlist.id}>
                      <span className="cap-title">{`Child ${wishlist.id}:`}</span>
                      {productListEmptyCheck(wishlist.products, 'approved') ? (
                        `You haven't approved any gift for Child ${wishlist.id} yet`
                      ) : (
                        <React.Fragment>
                          {wishlist.products.map((product: Product | 'loading') => {
                            return (
                              <>
                                {product === 'loading' && <Loader />}
                                {product !== 'loading' && product.approvalStatus === 'approved' && (
                                  <div className="overview-product-card" key={product.id}>
                                    <div className="opc-image">
                                      <div style={{ backgroundImage: `url(${product.image})` }}></div>
                                    </div>
                                    <div className="opc-product-info">
                                      <span className="opc-title">{product.title}</span>
                                      <span className="opc-price">{product.price}</span>
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
                              </>
                            );
                          })}
                        </React.Fragment>
                      )}
                    </div>
                  );
                })
              : `You haven't approved any gift yet`}
          </div>
          {totalPrice > 0 && (
            <>
              {!wishlistEmptyCheck(wishlists, 'pending') && (
                <div className="overview-pending-list">
                  <span className="section-title">These items are still in your wishlists:</span>
                  <div className="carousel-section">
                    <div className="btn-prev">
                      <span
                        onClick={() => {
                          slideCarousel('prev');
                        }}
                      >
                        «
                      </span>
                    </div>
                    <div className="wl-carousel">
                      <div
                        className="wrapper"
                        style={{ transform: `translateX(${carouselTranslateXValue}px)` }}
                        ref={divRef}
                      >
                        {wishlists.map((wishlist: WishlistWithProductDetail, index: number) => {
                          const isNotEmptyPending = wishlist.products.some((product) => {
                            return product !== 'loading' && product.approvalStatus === 'pending';
                          });
                          return (
                            isNotEmptyPending && (
                              <div className="opl-wrapper">
                                <div key={index} className="opl-child">
                                  <span className="opl-title">Child {wishlist.id}</span>
                                  <div className="child-pending-list" key={index}>
                                    {wishlist.products.map((product: Product | 'loading') => {
                                      return (
                                        <>
                                          {product === 'loading' && <Loader />}
                                          {product !== 'loading' && product.approvalStatus === 'pending' && (
                                            <div className="opl-child-wrapper">
                                              <div className="product-card-img">
                                                <div style={{ backgroundImage: `url(${product.image})` }}></div>
                                              </div>
                                              <div className="product-card-content">
                                                <span title={product.title} className="title">
                                                  {product.title}
                                                </span>
                                                <p className="price">€{product.price}</p>
                                                <div className="product-card-btn">
                                                  <a className="add-to-wishlist">Add to cart</a>
                                                  <a className="remove-from-wishlist">Remove</a>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                    <div className="btn-next">
                      <span
                        onClick={() => {
                          slideCarousel('next');
                        }}
                      >
                        »
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
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
                {approvedProductList.length
                  ? 'You have these gifts in your cart:'
                  : `You haven't approved any gifts yet`}
              </h6>
              {approvedProductList &&
                approvedProductList.map(({ id, image, title, quantity, price }: ProductWithQuantity) => {
                  return (
                    <div key={id} className="confirmation-product-card">
                      <h5>{title}</h5>
                      <img style={{ width: '50px', height: '50px', borderRadius: '20px' }} src={image} alt={title} />
                      <p>Quantity: {quantity}</p>
                      <p>
                        Total: €
                        {quantity > 1 ? ((price * quantity * (10 - quantity)) / 10).toFixed(2) : price.toFixed(2)}
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
    </div>
  );
};
