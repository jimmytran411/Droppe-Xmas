import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React, { useEffect, useState } from 'react';
import { IWishlistWithProductDetail } from 'WishLists';
import { Product } from 'WishLists/Product';
import Modal from '../Modal';

interface IProductWithQuantity extends IProduct {
  quantity: number;
}

export const Overview = () => {
  const { totalPrice, totalPriceWithoutDiscount, allwishlist, productListEmptyCheck } = useCart();
  const [approvedProductList, setApprovedProductList] = useState<IProductWithQuantity[]>();
  const [confirm, setConfirm] = useState(false);

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

  const toggleModal = () => setConfirm(!confirm);

  useEffect(() => {
    const allApprovedProducts: IProduct[] = [];
    allwishlist.forEach((wishlist: IWishlistWithProductDetail) => {
      return wishlist.products.forEach(
        (product: IProduct) => product.currentState === 'approved' && allApprovedProducts.push(product)
      );
    });
    const mapOfApprovedProducts = allApprovedProducts
      .reduce((mapObj, product: IProduct) => {
        const id: string = JSON.stringify([product.id]);
        if (!mapObj.has(id)) mapObj.set(id, { ...product, quantity: 0 });
        mapObj.get(id).quantity++;
        return mapObj;
      }, new Map())
      .values();
    const approvedProductWithQuantity: IProductWithQuantity[] = [...mapOfApprovedProducts];
    setApprovedProductList(approvedProductWithQuantity);
  }, [allwishlist]);

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
      <button
        onClick={() => {
          toggleModal();
        }}
      >
        Proceed to Checkout
      </button>
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
      {confirm && (
        <Modal>
          <div>
            <p>You have these items in your cart:</p>
            {approvedProductList &&
              approvedProductList.map(({ id, image, title, quantity, price }: IProductWithQuantity) => {
                return (
                  <div key={id} className="confirmation-product-card">
                    <img style={{ width: '50px', height: '50px', borderRadius: '20px' }} src={image} alt={title} />
                    <h5>{title}</h5>
                    <p>Quantity: {quantity}</p>
                    <p>Total: {quantity > 1 ? (price * quantity * (10 - quantity)) / 10 : price.toFixed(2)}</p>
                    {quantity > 1 && <p>You save: {(price * quantity * quantity) / 10}</p>}
                  </div>
                );
              })}
            <button>Pay</button>
            <button onClick={toggleModal}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
