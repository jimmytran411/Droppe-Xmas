import * as React from 'react';

import { CartProvider } from './CartContext';
import { PriceProvider } from './PriceContext';
import { ProductProvider } from './ProductContext';
import { SortProvider } from './SortContext';

export const AppProviders = ({ children }: any) => {
  return (
    <CartProvider>
      <ProductProvider>
        <PriceProvider>
          <SortProvider>{children}</SortProvider>
        </PriceProvider>
      </ProductProvider>
    </CartProvider>
  );
};
