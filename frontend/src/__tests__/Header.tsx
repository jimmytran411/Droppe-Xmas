import React from 'react';
import { render } from '@testing-library/react';
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
};
const mockPriceValue = {
  totalPrice: 420,
  totalDiscount: 240,
};
test('Test Header show value from provider', () => {
  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
    </CartContext.Provider>
  );
  const { getByText, getByRole } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
    {
      wrapper,
    }
  );

  expect(getByText(/total saving/i)).toBeInTheDocument();
  expect(getByText(/€240/i)).toBeInTheDocument();
  expect(getByText(/€420/i)).toBeInTheDocument();

  expect(getByText(/🛒/i).textContent).toBe('🛒');
  expect(getByRole('button', { name: /View Cart/i })).toBeInTheDocument();
});
