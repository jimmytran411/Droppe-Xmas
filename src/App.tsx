import { IWishList } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { CurrentWishList } from 'WishLists';
import './App.css';

function App() {
  const { allwishlist, setCurrentWL, currentWishList } = useCart();
  return (
    <div className="App">
      <header className="App-header">Droppe Assignment</header>
      {allwishlist &&
        allwishlist.map((wishlist: IWishList, index: number) => {
          return (
            <button
              key={index}
              aria-label={`child-${wishlist.id}`}
              onClick={() => {
                setCurrentWL(wishlist);
              }}
            >{`Child ${wishlist.id}`}</button>
          );
        })}
      {currentWishList && <CurrentWishList {...currentWishList} />}
    </div>
  );
}

export default App;
