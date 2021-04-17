import React, { useEffect, useState } from 'react';

import { useCart } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishLists';
import { UserCard, UserCardProps } from './UserCard';
import './Landing.css';

export const Landing = () => {
  const [userInfo, setUserInfo] = useState<UserCardProps[]>();
  const [loading, setLoading] = useState(true);
  const { wishlists } = useCart();

  const getUserCard = (wishlist: WishlistWithProductDetail) => {
    let approveCount: number = 0,
      discardCount: number = 0,
      pendingcount: number = 0;
    wishlist.products.forEach((product) => {
      if (!product) {
        setLoading(true);
      } else {
        setLoading(false);
      }
      switch (product.approvalStatus) {
        case 'approved':
          approveCount++;
          break;
        case 'discarded':
          discardCount++;
          break;
        case 'pending':
          pendingcount++;
          break;
        default:
          console.log('Something went wrong');
      }
    });

    const userCardProp: UserCardProps = {
      approvedProductCount: approveCount,
      discardedProductCount: discardCount,
      pendingProductCount: pendingcount,
      userName: `username_${wishlist.id}`,
      wishlistId: wishlist.id,
    };
    return userCardProp;
  };

  useEffect(() => {
    const userCardProps: UserCardProps[] = wishlists.map((wishlist) => {
      return getUserCard(wishlist);
    });
    setUserInfo(userCardProps);
  }, [wishlists]);
  return (
    <div className="landing">
      {loading && (
        <div className="loader">
          <b>Loading</b>
        </div>
      )}
      {!loading && (
        <>
          <div className="landing-row row-header">
            <span>User's wishlist</span>
            <span>Approved</span>
            <span>Discarded</span>
            <span>Pending</span>
          </div>
          {userInfo &&
            userInfo.map((userCard, index) => {
              return (
                <div key={index} className={`user-card-container`}>
                  <UserCard {...userCard} />
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};
