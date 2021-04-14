import React from 'react';
import { render } from '@testing-library/react';
import { IProduct } from 'api/wishList';
import { CurrentWishList, IWishlistWithProductDetail } from 'WishLists';

test('Render discard list with test input', () => {
  const testCurrentWL: IProduct[] = [
    {
      id: 1,
      title: 'test title 1',
      price: 111,
      description: 'test description 1',
      image: 'test img link 1',
      category: 'test category 1',
      currentState: 'pending',
    },
    {
      id: 2,
      title: 'test title 2',
      price: 222,
      description: 'test description 2',
      image: 'test img link 2',
      category: 'test category 2',
      currentState: 'approved',
    },
    {
      id: 3,
      title: 'test title 3',
      price: 333,
      description: 'test description 3',
      image: 'test img link 3',
      category: 'test category 3',
      currentState: 'discarded',
    },
  ];
  const testCurrentWLProp: IWishlistWithProductDetail = { id: 1, userid: 1, products: testCurrentWL };

  const { getByText, getByRole } = render(<CurrentWishList {...testCurrentWLProp} />);
  expect(getByText(/Current Cart: €0.00/i)).toBeInTheDocument();
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-2/i })).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-2/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-2/i })).toBeInTheDocument();

  expect(getByText(/test title 3/i)).toBeInTheDocument();
  expect(getByText(/333/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-3/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-3/i })).toBeInTheDocument();
});
