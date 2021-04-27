import React, { useRef, useState } from 'react';

import { usePrice } from 'context/PriceContext';
import { useCart } from 'context/CartContext';
import { Product } from 'api/wishList';
import { Loader } from 'utils/Loader';
import { WishlistWithProductDetail } from 'Views/WishList';
import { ProductCard } from 'Views/WishList/ProductCard';
import { ApprovalStatus, Loading } from 'common/commonType';

type CarouselDirection = 'next' | 'prev';
interface ProductCarouselProps {
  givenStatus: ApprovalStatus;
}

export const ProductCarousel = ({ givenStatus }: ProductCarouselProps) => {
  const [carouselTranslateXValue, setCarouselTranslateXValue] = useState(0);

  const { totalPrice } = usePrice();
  const { wishlists } = useCart();

  const wishlistEmptyCheck = (wishListsToCheck: WishlistWithProductDetail[], givenState: ApprovalStatus) => {
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
  const slideCarousel = (direction: CarouselDirection) => {
    const scrollWidth = divRef.current?.scrollWidth || 0;
    const offsetWidth = divRef.current?.offsetWidth || 0;
    const increase = offsetWidth / 2;

    let distance = carouselTranslateXValue;
    direction === 'next' ? (distance -= increase) : (distance += increase);
    distance < offsetWidth - scrollWidth && (distance = offsetWidth - scrollWidth);
    distance > 0 && (distance = 0);

    setCarouselTranslateXValue(distance);
  };
  return (
    <>
      {totalPrice > 0 && (
        <>
          {!wishlistEmptyCheck(wishlists, givenStatus) && (
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
                        return product !== 'loading' && product.approvalStatus === givenStatus;
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
                                      {product !== 'loading' && product.approvalStatus === givenStatus && (
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
