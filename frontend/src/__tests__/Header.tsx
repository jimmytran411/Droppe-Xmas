import React from 'react';
import { render } from '@testing-library/react';
import { Product } from 'api/wishList';
import { CartContext } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishList';
import { Header } from 'Header';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { PriceContext } from 'context/PriceContext';

const testCurrentWL: Product[] = [
  {
    id: 1,
    title: 'test title 1',
    price: 111,
    description: 'test description 1',
    image: 'test img link 1',
    category: 'test category 1',
    approvalStatus: 'pending',
  },
  {
    id: 2,
    title: 'test title 2',
    price: 222,
    description: 'test description 2',
    image: 'test img link 2',
    category: 'test category 2',
    approvalStatus: 'approved',
  },
  {
    id: 3,
    title: 'test title 3',
    price: 333,
    description: 'test description 3',
    image: 'test img link 3',
    category: 'test category 3',
    approvalStatus: 'discarded',
  },
];
const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testCurrentWL };
const mockCartValue = {
  wishlists: [
    { ...testCurrentWLProp },
    { ...testCurrentWLProp, id: 2, userid: 2 },
    { ...testCurrentWLProp, id: 3, userid: 3 },
  ],
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
