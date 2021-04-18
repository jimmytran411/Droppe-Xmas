import React, { useRef, useState } from 'react';

import { usePrice } from 'context/PriceContext';
import { Loading, useCart } from 'context/CartContext';
import { Product } from 'api/wishList';
import { Loader } from 'utils/Loader';
import { WishlistWithProductDetail } from 'WishList';
import { ProductCard } from 'WishList/ProductCard';

export const PendingListCarousel = () => {
  const [carouselTranslateXValue, setCarouselTranslateXValue] = useState(0);

  const { totalPrice } = usePrice();
  const { wishlists, handleProduct } = useCart();

  const wishlistEmptyCheck = (
    wishListsToCheck: WishlistWithProductDetail[],
    givenState: 'pending' | 'approved' | 'discarded'
  ) => {
    const checkedWishlists = wishListsToCheck.map(({ products }: WishlistWithProductDetail) => {
      return products.filter(
        (product: Product | Loading) => product !== 'loading' && product.approvalStatus === givenState
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
                          <div key={index} className="opl-wrapper">
                            <div className="opl-child">
                              <span className="opl-title">Username_{wishlist.id}</span>
                              <div className="child-pending-list">
                                {wishlist.products.map((product: Product | Loading, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      {product === 'loading' && <Loader />}
                                      {product !== 'loading' && product.approvalStatus === 'pending' && (
                                        <ProductCard product={product} wishlist={wishlist} />
                                      )}
                                    </React.Fragment>
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
