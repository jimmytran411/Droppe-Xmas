import { useCart } from 'context/CartContext';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const { wishlists } = useCart();

  return (
    <div className="navbar">
      {wishlists.map((wishlist) => {
        return (
          <div className="navbar-list">
            <NavLink activeClassName="navbar-active" to={`/wishlist/${wishlist.id}`}>
              Wishlist {wishlist.id}
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};
