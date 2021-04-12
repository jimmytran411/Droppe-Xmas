import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';
import { Product } from 'WishLists/Product';

export const Overview = () => {
  const { totalPrice, totalPriceWithoutDiscount, allwishlist } = useCart();
  return (
    <div className="overview-container">
      <div className="overview-approve-list">
        {allwishlist.map((wishlist: IWishlistWithProductDetail) => {
          return wishlist.products.map((product: IProduct) => {
            return product.currentState === 'approved' && <Product key={product.id} {...product} />;
          });
        })}
      </div>
      <div className="total-cost">
        Total: <b>€{totalPrice.toFixed(2)}</b>
      </div>
      <div className="total-saving">You save: €{(totalPriceWithoutDiscount - totalPrice).toFixed(2)}</div>
      <div className="overview-pending-list">
        <h6>These items are still in your wishlists:</h6>
        {allwishlist.map((wishlist: IWishlistWithProductDetail, index: number) => {
          return (
            <div key={index}>
              <p>Child {wishlist.id}</p>
              {wishlist.products.map((product: IProduct) => {
                return product.currentState === 'pending' && <Product key={product.id} {...product} />;
              })}
            </div>
          );
        })}
      </div>
      <div className="overview-discard-list">
        <h6>You discard these:</h6>
        {allwishlist.map((wishlist: IWishlistWithProductDetail, index: number) => {
          return (
            <div key={index}>
              <p>Child {wishlist.id}</p>
              {wishlist.products.map((product: IProduct) => {
                return product.currentState === 'pending' && <Product key={product.id} {...product} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
