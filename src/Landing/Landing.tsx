import React, { useEffect, useState } from 'react';

import { useCart } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishLists';
import { UserCard, UserCardProps } from './UserCard';
import './Landing.css';

export const Landing = () => {
  const [userInfo, setUserInfo] = useState<UserCardProps[]>();
  const { wishlists } = useCart();

  useEffect(() => {
    const userCardProps: UserCardProps[] = wishlists.map((wishlist) => {
      return getUserCard(wishlist);
    });
    setUserInfo(userCardProps);
  }, [wishlists]);
  return (
    <div className="landing">
      {userInfo &&
        userInfo.map((userCard, index) => {
          return (
            <div key={index} className={`user-card-container`}>
              <UserCard {...userCard} />
            </div>
          );
        })}
    </div>
  );
};

const getUserCard = (wishlist: WishlistWithProductDetail) => {
  let approveCount: number = 0,
    discardCount: number = 0,
    pendingcount: number = 0,
    username: string = '';
  wishlist.products.forEach((product) => {
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
  switch (wishlist.id) {
    case 1:
      username = 'John';
      break;
    case 2:
      username = 'Jack';
      break;
    case 3:
      username = 'Jim';
      break;
    case 4:
      username = 'Josh';
      break;
    case 5:
      username = 'Jane';
      break;
    default:
      console.log('No other name');
  }
  const userCardProp: UserCardProps = {
    approvedProductCount: approveCount,
    discardedProductCount: discardCount,
    pendingProductCount: pendingcount,
    userName: username,
    wishlistId: wishlist.id,
  };
  return userCardProp;
};
