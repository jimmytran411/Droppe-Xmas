import { WishlistWithProductStatus, ProductWithQuantity } from 'common/commonInterface';
import * as React from 'react';

import { getProductWithQuantity } from 'utils/wishlistAndProduct';
import { useCart } from './CartContext';
import { useProduct } from './ProductContext';

export interface PriceAndDiscount {
  totalPrice: number;
  totalDiscount: number;
}

const initialPriceValue: PriceAndDiscount = {
  totalPrice: 0,
  totalDiscount: 0,
};
const PriceContext = React.createContext<PriceAndDiscount>(initialPriceValue);
function PriceProvider(props: any) {
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [totalDiscount, setTotalDiscount] = React.useState<number>(0);

  const { wishlists } = useCart();
  const { getProductFromContext } = useProduct();

  const calculateTotalPrice = (wishlists: WishlistWithProductStatus[]) => {
    const approvedProductList = getProductWithQuantity(wishlists, 'approved');
    let totalPrice = 0;
    approvedProductList.forEach(({ productId, quantity }: ProductWithQuantity) => {
      const currentProductDetail = getProductFromContext(productId);
      const price = currentProductDetail ? currentProductDetail.price : 0;

      quantity > 1 ? (totalPrice += (price * quantity * (10 - quantity)) / 10) : (totalPrice += price);
    });
    return totalPrice;
  };

  const calculateTotalDiscount = (wishlists: WishlistWithProductStatus[]) => {
    const approvedProductList = getProductWithQuantity(wishlists, 'approved');
    let totalDiscount = 0;
    approvedProductList.forEach(({ productId, quantity }: ProductWithQuantity) => {
      const currentProductDetail = getProductFromContext(productId);
      const price = currentProductDetail ? currentProductDetail.price : 0;

      quantity > 1 && (totalDiscount += (price * quantity * quantity) / 10);
    });
    return totalDiscount;
  };

  React.useEffect(() => {
    const updatedTotalPrice = calculateTotalPrice(wishlists);
    setTotalPrice(updatedTotalPrice);
    const updatedTotalDiscount = calculateTotalDiscount(wishlists);
    setTotalDiscount(updatedTotalDiscount);
  }, [wishlists]);

  return (
    <PriceContext.Provider
      value={{
        totalPrice,
        totalDiscount,
      }}
      {...props}
    />
  );
}
const usePrice = () => React.useContext(PriceContext);

export { PriceProvider, usePrice, PriceContext };
