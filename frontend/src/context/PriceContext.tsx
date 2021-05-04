import { WishlistWithProductStatus, ProductWithQuantityList } from 'common/commonInterface';
import * as React from 'react';

import { getUniqueProductWithGivenStatusAndQuantity } from 'utils/wishlistAndProduct';
import { useCart } from './CartContext';
import { useProduct } from './ProductContext';

export interface PriceContextProps {
  totalPrice: number;
  totalDiscount: number;
}

const initialPriceValue: PriceContextProps = {
  totalPrice: 0,
  totalDiscount: 0,
};
const PriceContext = React.createContext<PriceContextProps>(initialPriceValue);
const PriceProvider: React.FC = (props: any) => {
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [totalDiscount, setTotalDiscount] = React.useState<number>(0);

  const { wishlists } = useCart();
  const { getProductFromContext, productDetailList } = useProduct();

  React.useEffect(() => {
    const calculateTotal = (wishlists: WishlistWithProductStatus[], callback: (...args: any) => number) => {
      let total = 0;

      getUniqueProductWithGivenStatusAndQuantity(wishlists, 'approved').forEach(
        ({ productId, quantity }: ProductWithQuantityList) => {
          const currentProductDetail = getProductFromContext(productId);
          const price = currentProductDetail ? currentProductDetail.price : 0;
          total += callback(total, quantity, price);
        }
      );

      return total;
    };
    const price = calculateTotal(
      wishlists,
      (total, quantity, price) => (total = quantity > 1 ? (price * quantity * (10 - quantity)) / 10 : price)
    );
    setTotalPrice(price);

    const discount = calculateTotal(
      wishlists,
      (total, quantity, price) => (total = quantity > 1 ? (price * quantity * quantity) / 10 : 0)
    );
    setTotalDiscount(discount);
  }, [wishlists, productDetailList, getProductFromContext]);

  return (
    <PriceContext.Provider
      value={{
        totalPrice,
        totalDiscount,
      }}
      {...props}
    />
  );
};
const usePrice = (): PriceContextProps => React.useContext(PriceContext);

export { PriceProvider, usePrice, PriceContext };
