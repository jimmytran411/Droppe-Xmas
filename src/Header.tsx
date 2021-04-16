import { useCart } from 'context/CartContext';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [totalTextGroup, setTotalTextGroup] = useState(true);
  const { totalPrice, totalDiscount, totalApprovedProduct } = useCart();
  return (
    <header className="App-header">
      Droppe Assignment
      {totalTextGroup && (
        <div className="total-text-group">
          <span className="total-price">Total: €{totalPrice.toFixed(2)}</span>
          <span className="total-saving">Total Saving: €{totalDiscount.toFixed(2)}</span>
          <span className="total-approved-product">#IconCart here:{totalApprovedProduct}</span>
          <Link to="/overview">
            <button
              className="checkout"
              onClick={() => {
                setTotalTextGroup(false);
              }}
            >
              Checkout
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};
