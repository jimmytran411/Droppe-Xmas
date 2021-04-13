import { useCart } from 'context/CartContext';
import React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';

export interface IHeader {
  handleCheckout: (overviewState: boolean) => void;
}

export const Header = ({ handleCheckout }: IHeader) => {
  const { allwishlist, handleOpenWishList, totalPrice, totalPriceWithoutDiscount } = useCart();
  return (
    <header className="App-header">
      Droppe Assignment
      <span className="total-price">Total: €{totalPrice.toFixed(2)}</span>
      <span className="total-saving">Total Saving: €{(totalPriceWithoutDiscount - totalPrice).toFixed(2)}</span>
      <button
        className="checkout"
        onClick={() => {
          handleCheckout(true);
        }}
      >
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
                  handleCheckout(false);
                }}
              >{`Child ${wishlist.id}`}</button>
            );
          })}
      </div>
    </header>
  );
};
