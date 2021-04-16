import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { countTotalProductWithGivenStatus } from 'utils/wishlistAndProduct';

export const Header = () => {
  const [totalApprovedProduct, setTotalApprovedProduct] = React.useState<number>(0);

  const { wishlists } = useCart();
  const { totalPrice, totalDiscount } = usePrice();

  useEffect(() => {
    const totalApprovedProduct = countTotalProductWithGivenStatus(wishlists, 'approved');
    setTotalApprovedProduct(totalApprovedProduct);
  }, [wishlists]);
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
