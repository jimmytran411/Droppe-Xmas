import React from 'react';
import { Link } from 'react-router-dom';

export interface UserCardProps {
  userName: string;
  approvedProductCount: number;
  discardedProductCount: number;
  pendingProductCount: number;
  wishlistId: number;
}

export const UserCard = ({
  userName,
  approvedProductCount,
  discardedProductCount,
  pendingProductCount,
  wishlistId,
}: UserCardProps) => {
  return (
    <Link to={`/wishlist/${wishlistId}`}>
      <div className="landing-row">
        <div className="landing-row--userInfo">
          <img src="https://randomuser.me/api/portraits/lego/8.jpg"></img>
          <span>userId_{wishlistId}</span>
        </div>
        <div className="user-card-approved-count">
          <p>{approvedProductCount}</p>
        </div>
        <div className="user-card-discarded-count">
          <p>{discardedProductCount}</p>
        </div>
        <div className="user-card-pending-count">
          <p>{pendingProductCount}</p>
        </div>
      </div>
    </Link>
  );
};
