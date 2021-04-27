import * as React from 'react';

import { CartProvider } from './CartContext';
import { PriceProvider } from './PriceContext';
import { ProductProvider } from './ProductContext';

export const AppProviders = ({ children }: any) => {
  return (
    <CartProvider>
      <PriceProvider>
        <ProductProvider>{children}</ProductProvider>
      </PriceProvider>
    </CartProvider>
  );
};
