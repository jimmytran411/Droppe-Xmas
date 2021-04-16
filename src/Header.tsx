import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { totalApprovedProduct } = useCart();
  const { totalPrice, totalDiscount } = usePrice();
  return (
    <header className="App-header">
      Droppe Assignment
      <div className="total-text-group">
        <span className="total-price">Total: €{totalPrice.toFixed(2)}</span>
        <span className="total-saving">Total Saving: €{totalDiscount.toFixed(2)}</span>
        <span className="total-approved-product">#IconCart here:{totalApprovedProduct}</span>
        <Link to="/overview">
          <button className="checkout">Checkout</button>
        </Link>
      </div>
    </header>
  );
};
