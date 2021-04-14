import React from 'react';
import { render } from '@testing-library/react';
import { Product } from '../WishLists/Product';
import { IProduct } from 'api/wishList';

const testProduct: IProduct = {
  id: 1,
  title: 'test title',
  price: 111,
  description: 'test description',
  image: 'test img link',
  category: 'test category',
  currentState: 'pending',
};

test('Render Product component with given product', () => {
  const { getByText } = render(<Product {...testProduct} />);
  expect(getByText(/test title/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
});
