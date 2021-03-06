import { useCart } from 'context/CartContext';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { wishlists } = useCart();

  return (
    <div className="navbar">
      {wishlists.map((wishlist, index) => {
        return (
          <div key={index} className="navbar-list">
            <NavLink activeClassName="navbar-active" to={`/wishlist/${wishlist.wishlistId}`}>
              Username_{wishlist.wishlistId}
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};
