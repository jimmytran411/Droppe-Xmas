import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Product } from 'api/wishList';
import { WishlistWithProductDetail } from 'Views/WishList';
import { Landing } from 'Views/Landing/Landing';
import { CartContext } from 'context/CartContext';

test('Render discard list with test input', () => {
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
    {
      id: 3,
      title: 'test title 3',
      price: 333,
      description: 'test description 3',
      image: 'test img link 3',
      category: 'test category 3',
      approvalStatus: 'discarded',
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

  const history = createMemoryHistory({ initialEntries: ['/'] });
  const wrapper = ({ children }: any) => <CartContext.Provider value={mockCartValue}>{children}</CartContext.Provider>;

  const { getByText } = render(
    <Router history={history}>
      <Landing />
    </Router>,
    { wrapper }
  );
  expect(getByText(/user's wishlist/i)).toBeInTheDocument();
  expect(getByText(/username_1/i)).toBeInTheDocument();
  expect(getByText(/approved/i)).toBeInTheDocument();

  expect(getByText(/discarded/i)).toBeInTheDocument();
  expect(getByText(/3/i)).toBeInTheDocument();

  expect(getByText(/pending/i)).toBeInTheDocument();
  expect(getByText(/2/i)).toBeInTheDocument();
});
