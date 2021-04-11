import { useCart } from 'context/CartContext';
import React from 'react';
import { CurrentWishList, IWishlistWithProductDetail } from 'WishLists';
import './App.css';

function App() {
  const { allwishlist, handleOpenWishList, currentWishList } = useCart();
  return (
    <div className="App">
      <header className="App-header">Droppe Assignment</header>
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
      {currentWishList && <CurrentWishList {...currentWishList} />}
    </div>
  );
}

export default App;
