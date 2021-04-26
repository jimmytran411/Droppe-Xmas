import * as React from 'react';

import { calculateTotalPrice, calculateTotalDiscount } from 'utils/priceCalculation';
import { useCart } from './CartContext';

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
  const { wishlists } = useCart();
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [totalDiscount, setTotalDiscount] = React.useState<number>(0);

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
