import { useCart } from 'context/CartContext';
import React, { useState } from 'react';
import { IWishlistWithProductDetail } from 'WishLists';

export interface IHeader {
  handleCheckout: (overviewState: boolean) => void;
}

export const Header = ({ handleCheckout }: IHeader) => {
  const [totalTextGroup, setTotalTextGroup] = useState(true);
  const { allwishlist, handleOpenWishList, totalPrice, totalPriceWithoutDiscount } = useCart();
  return (
    <header className="App-header">
      Droppe Assignment
      {totalTextGroup && (
        <div className="total-text-group">
          <span className="total-price">Total: €{totalPrice.toFixed(2)}</span>
          <span className="total-saving">Total Saving: €{(totalPriceWithoutDiscount - totalPrice).toFixed(2)}</span>
          <button
            className="checkout"
            onClick={() => {
              handleCheckout(true);
              setTotalTextGroup(false);
            }}
          >
            Checkout
          </button>
        </div>
      )}
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
                  setTotalTextGroup(true);
                }}
              >{`Child ${wishlist.id}`}</button>
            );
          })}
      </div>
    </header>
  );
};
