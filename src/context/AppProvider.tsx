import * as React from 'react';
import { CartProvider } from './CartContext';

export const AppProviders = ({ children }: any) => {
  return <CartProvider>{children}</CartProvider>;
};
