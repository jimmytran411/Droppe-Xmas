import * as React from 'react';
import { CartProvider } from './CartContext';
import { PriceProvider } from './PriceContext';

export const AppProviders = ({ children }: any) => {
  return (
    <CartProvider>
      <PriceProvider>{children}</PriceProvider>
    </CartProvider>
  );
};
