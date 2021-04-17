import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Product } from 'api/wishList';
import { Overview } from 'Overview';
import { CartContext } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishList';
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
  wishlists: [{ ...testCurrentWLProp }],
  handleProduct: jest.fn(),
  handlePayment: jest.fn(),
};
const mockPriceValue = {
  totalPrice: 420,
  totalDiscount: 240,
};

test('Test Overview show value from provider', () => {
  const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testCurrentWL };
  const history = createMemoryHistory({ initialEntries: ['/overview'] });
  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
    </CartContext.Provider>
  );
  const { getByText, getByRole } = render(
    <Router history={history}>
      <Overview />
    </Router>,
    {
      wrapper,
    }
  );

  expect(getByText(/total:/i).textContent).toBe('Total: €420.00');
  expect(getByText(/you save:/i).textContent).toBe('You save: €240.00');
  expect(getByText(/These items are still in your wishlists:/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /checkout/i })).toBeInTheDocument;
  expect(getByRole('button', { name: '❌' })).toBeInTheDocument();
});
