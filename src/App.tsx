import { useCart } from 'context/CartContext';
import { Header } from 'Header';
import { Overview } from 'Overview';
import React, { useState } from 'react';
import { CurrentWishList } from 'WishLists';
// import './App.css';

function App() {
  const [overview, setOverview] = useState(false);
  const { currentWishList } = useCart();
  const handleCheckout = (overviewState: boolean) => {
    setOverview(overviewState);
  };
  return (
    <div className="App">
      <Header {...{ handleCheckout }} />
      {!overview && currentWishList && <CurrentWishList {...currentWishList} />}
      {overview && <Overview />}
    </div>
  );
}

export default App;
