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
      <div className="user-card">
        <h4>{userName}</h4>
        <div className="user-card-approved-count">
          <p>✓</p>
          <p>{approvedProductCount}</p>
        </div>
        <div className="user-card-discarded-count">
          <p>❌</p>
          <p>{discardedProductCount}</p>
        </div>
        <div className="user-card-pending-count">
          <p>❓</p>
          <p>{pendingProductCount}</p>
        </div>
      </div>
    </Link>
  );
};
