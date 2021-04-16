import React from 'react';
import { render } from '@testing-library/react';
import { ProductCard } from '../WishLists/ProductCard';
import { Product } from 'api/wishList';

const testProduct: Product = {
  id: 1,
  title: 'test title',
  price: 111,
  description: 'test description',
  image: 'test img link',
  category: 'test category',
  approvalStatus: 'pending',
};

test('Render Product component with given product', () => {
  const { getByText } = render(<ProductCard {...testProduct} />);
  expect(getByText(/test title/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
});
