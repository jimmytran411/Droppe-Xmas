import React from 'react';
import { render } from '@testing-library/react';
import { Product } from 'api/wishList';
import { WishList, WishlistWithProductDetail } from 'WishLists';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

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
  const history = createMemoryHistory({ initialEntries: ['/wishlist/1'] });
  const { getByText, getByRole } = render(
    <Router history={history}>
      <WishList {...testCurrentWLProp} />
    </Router>
  );
  expect(getByText(/Current Cart: €222.00/i)).toBeInTheDocument();
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/€111/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-2/i })).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-2/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-2/i })).toBeInTheDocument();

  expect(getByText(/test title 3/i)).toBeInTheDocument();
  expect(getByText(/€333/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-3/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-3/i })).toBeInTheDocument();
});
