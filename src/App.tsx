import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useCart } from 'context/CartContext';
import { Header } from 'Header';
import { Overview } from 'Overview';
import { WishList, WishlistWithProductDetail } from 'WishLists';
import { Landing } from 'Landing/Landing';

function App() {
  const { wishlists } = useCart();

  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path={`/wishlist/1`}>
            <WishList {...wishlists[0]} />
          </Route>
          <Route path={`/wishlist/2`}>
            <WishList {...wishlists[1]} />
          </Route>
          <Route path={`/wishlist/3`}>
            <WishList {...wishlists[2]} />
          </Route>
          <Route path={`/wishlist/4`}>
            <WishList {...wishlists[3]} />
          </Route>
          <Route path={`/wishlist/5`}>
            <WishList {...wishlists[4]} />
          </Route>
          <Route path="/overview">
            <Overview />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
