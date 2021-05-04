import React, { useEffect, useState } from 'react';

import { useCart } from 'context/CartContext';
import { UserCard, UserCardProps } from './UserCard';
import './Landing.css';
import { WishlistWithProductStatus } from 'common/commonInterface';

export const Landing: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserCardProps[]>();
  const { wishlists } = useCart();

  const getUserCard = (wishlist: WishlistWithProductStatus) => {
    let approveCount = 0,
      discardCount = 0,
      pendingcount = 0;
    wishlist.productList.forEach((product) => {
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
      userName: `username_${wishlist.wishlistId}`,
      wishlistId: wishlist.wishlistId,
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
    <div className="landing-container">
      <div className="main">
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
      </div>
      <div className="side"></div>
    </div>
  );
};
