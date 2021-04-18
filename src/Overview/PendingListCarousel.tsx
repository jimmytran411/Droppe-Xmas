import React, { useRef, useState } from 'react';

import { usePrice } from 'context/PriceContext';
import { useCart } from 'context/CartContext';
import { Product } from 'api/wishList';
import { Loader } from 'utils/Loader';
import { WishlistWithProductDetail } from 'WishList';

export const PendingListCarousel = () => {
  const [carouselTranslateXValue, setCarouselTranslateXValue] = useState(0);

  const { totalPrice } = usePrice();
  const { wishlists } = useCart();

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

  const divRef = useRef<HTMLDivElement>(null);
  const slideCarousel = (direction: string) => {
    const a = divRef.current?.scrollWidth || 0;
    const b = divRef.current?.offsetWidth || 0;
    const increase = b / 2;

    if (direction === 'next') {
      setCarouselTranslateXValue((prev) => prev - increase);
    }
    if (direction === 'prev') {
      setCarouselTranslateXValue((prev) => prev + increase);
    }
    if (carouselTranslateXValue < b - a) {
      setCarouselTranslateXValue(b - a);
    }
    if (carouselTranslateXValue > 0) {
      setCarouselTranslateXValue(0);
    }
  };
  return (
    <>
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
    </>
  );
};
