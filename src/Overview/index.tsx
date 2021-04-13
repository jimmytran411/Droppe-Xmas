import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';
import { Product } from 'WishLists/Product';

export const Overview = () => {
  const { totalPrice, totalPriceWithoutDiscount, allwishlist, productListEmptyCheck } = useCart();
  const allWLEmptyCheck = (
    allWishList: IWishlistWithProductDetail[],
    givenState: 'pending' | 'approved' | 'discarded'
  ) => {
    const allWLCheck = allWishList.map(({ products }: IWishlistWithProductDetail) => {
      return products.filter((product: IProduct) => product.currentState === givenState);
    });
    return allWLCheck.some((a) => {
      return a.length;
    })
      ? false
      : true;
  };
  return (
    <div className="overview-container">
      <div className="overview-approve-list">
        {totalPrice > 0
          ? allwishlist.map((wishlist: IWishlistWithProductDetail) => {
              return (
                <div key={wishlist.id}>
                  <h5>{`Child ${wishlist.id}:`}</h5>
                  {productListEmptyCheck(wishlist.products, 'approved') ? (
                    `You haven't approved any gift for Child ${wishlist.id} yet`
                  ) : (
                    <React.Fragment>
                      {wishlist.products.map((product: IProduct) => {
                        return product.currentState === 'approved' && <Product key={product.id} {...product} />;
                      })}
                      )
                    </React.Fragment>
                  )}
                </div>
              );
            })
          : `You haven't approved any gift yet`}
      </div>
      <div className="total-cost">
        Total: <b>€{totalPrice.toFixed(2)}</b>
      </div>
      <div className="total-saving">You save: €{(totalPriceWithoutDiscount - totalPrice).toFixed(2)}</div>
      {!allWLEmptyCheck(allwishlist, 'pending') && (
        <div className="overview-pending-list">
          <h5>These items are still in your wishlists:</h5>
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
      )}
      {!allWLEmptyCheck(allwishlist, 'discarded') && (
        <div className="overview-discard-list">
          <h5>You discard these:</h5>
          {allwishlist.map((wishlist: IWishlistWithProductDetail) => {
            return wishlist.products.map((product: IProduct) => {
              return product.currentState === 'discarded' && <Product key={product.id} {...product} />;
            });
          })}
        </div>
      )}
    </div>
  );
};
