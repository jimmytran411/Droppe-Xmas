import { useCart } from 'context/CartContext';
import { Overview } from 'Overview';
import React, { useState } from 'react';
import { CurrentWishList, IWishlistWithProductDetail } from 'WishLists';
import './App.css';

function App() {
  const [overview, setOverview] = useState(false);
  const { allwishlist, handleOpenWishList, currentWishList, totalPrice, totalPriceWithoutDiscount } = useCart();
  const handleCheckout = () => {
    setOverview(true);
  };
  return (
    <div className="App">
      <header className="App-header">Droppe Assignment</header>
      <span className="total-price">Total: €{totalPrice.toFixed(2)}</span>
      <span className="total-saving">Total Saving: €{(totalPriceWithoutDiscount - totalPrice).toFixed(2)}</span>
      <button className="checkout" onClick={handleCheckout}>
        Checkout
      </button>
      <div className="wishlist-nav">
        {allwishlist &&
          allwishlist.map((wishlist: IWishlistWithProductDetail, index: number) => {
            return (
              <button
                key={index}
                aria-label={`child-${wishlist.id}`}
                onClick={() => {
                  handleOpenWishList(wishlist);
                  setOverview(false);
                }}
              >{`Child ${wishlist.id}`}</button>
            );
          })}
      </div>
      {!overview && currentWishList && <CurrentWishList {...currentWishList} />}
      {overview && <Overview />}
    </div>
  );
}

export default App;
