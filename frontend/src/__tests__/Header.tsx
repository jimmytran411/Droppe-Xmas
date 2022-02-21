import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { Header } from 'Header';
import { CartContext } from 'context/CartContext';
import { PriceContext } from 'context/PriceContext';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';

const testWishlist: ProductWithStatus[] = [
  {
    productId: 1,
    approvalStatus: 'pending',
  },
  {
    productId: 2,
    approvalStatus: 'approved',
  },
  {
    productId: 3,
    approvalStatus: 'discarded',
  },
];
const testWishlistProp: WishlistWithProductStatus = { wishlistId: 1, productList: testWishlist };
const mockCartValue = {
  wishlists: [{ ...testWishlistProp }, { ...testWishlistProp, wishlistId: 2 }, { ...testWishlistProp, wishlistId: 3 }],
  handleProduct: jest.fn(),
  handlePayment: jest.fn(),
  handleSorting: jest.fn(),
};
const mockPriceValue = {
  totalPrice: 420,
  totalDiscount: 240,
  getProductPrice: jest.fn(),
};
test('Test Header show value from provider', () => {
  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
    </CartContext.Provider>
  );
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
    {
      wrapper,
    }
  );

  expect(screen.getByText(/total saving/i)).toBeInTheDocument();
  expect(screen.getByText(/€240/i)).toBeInTheDocument();
  expect(screen.getByText(/€420/i)).toBeInTheDocument();

  expect(screen.getByText(/🛒/i)).toHaveTextContent('🛒');
  expect(screen.getByRole('button', { name: /View Cart/i })).toBeInTheDocument();
});
