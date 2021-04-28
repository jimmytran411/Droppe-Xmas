import * as React from 'react';

import { CartProvider } from './CartContext';
import { PriceProvider } from './PriceContext';
import { ProductProvider } from './ProductContext';

export const AppProviders = ({ children }: any) => {
  return (
    <CartProvider>
      <ProductProvider>
        <PriceProvider>{children}</PriceProvider>
      </ProductProvider>
    </CartProvider>
  );
};
