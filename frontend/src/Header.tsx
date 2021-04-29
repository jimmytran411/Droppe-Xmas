import { useCart } from 'context/CartContext';
import { usePrice } from 'context/PriceContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [totalApprovedProduct, setTotalApprovedProduct] = useState<number>(0);

  const { wishlists } = useCart();
  const { totalPrice, totalDiscount } = usePrice();

  useEffect(() => {
    let count = 0;
    wishlists.forEach((wishlist) =>
      wishlist.productList.forEach((product) => product.approvalStatus === 'approved' && count++)
    );
    setTotalApprovedProduct(count);
  }, [wishlists]);
  return (
    <header className="App-header">
      <h1>Droppe Assignment</h1>
      <div className="total-text-group">
        <Link to="/">
          <button>Home</button>
        </Link>
        <span className="total-price">
          <span>Total</span>
          <span>€{totalPrice.toFixed(2)}</span>
        </span>
        <span className="total-saving">
          <span>Total Saving</span>
          <span>€{totalDiscount.toFixed(2)}</span>
        </span>
        <span className="total-approved-product">
          <span>🛒</span>
          <span>{totalApprovedProduct}</span>
        </span>
        <Link to="/overview">
          <button className="view-cart">View cart</button>
        </Link>
      </div>
    </header>
  );
};
