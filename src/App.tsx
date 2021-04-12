import { useCart } from 'context/CartContext';
import React from 'react';
import { CurrentWishList, IWishlistWithProductDetail } from 'WishLists';
import './App.css';

function App() {
  const { allwishlist, handleOpenWishList, currentWishList, totalPrice, totalPriceWithoutDiscount } = useCart();
  return (
    <div className="App">
      <header className="App-header">Droppe Assignment</header>
      <span className="total-price">Total: €{totalPrice.toFixed(2)}</span>
      <span className="total-saving">Total Saving: €{(totalPriceWithoutDiscount - totalPrice).toFixed(2)}</span>
      <div className="wishlist-nav">
        {allwishlist &&
          allwishlist.map((wishlist: IWishlistWithProductDetail, index: number) => {
            return (
              <button
                key={index}
                aria-label={`child-${wishlist.id}`}
                onClick={() => {
                  handleOpenWishList(wishlist);
                }}
              >{`Child ${wishlist.id}`}</button>
            );
          })}
      </div>
      {currentWishList && <CurrentWishList {...currentWishList} />}
    </div>
  );
}

export default App;
