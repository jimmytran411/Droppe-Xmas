import React from 'react';
import { render } from '@testing-library/react';
import { ProductCard } from '../WishList/ProductCard';
import { Product } from 'api/wishList';
import { WishlistWithProductDetail } from 'WishList';

const testProduct: Product = {
  id: 1,
  title: 'test title',
  price: 111,
  description: 'test description',
  image: 'test img link',
  category: 'test category',
  approvalStatus: 'pending',
};
const testProductList: Product[] = [
  {
    id: 1,
    title: 'test title 1',
    price: 111,
    description: 'test description 1',
    image: 'test img link 1',
    category: 'test category 1',
    approvalStatus: 'pending',
  },
];
const testWishlist: WishlistWithProductDetail = { id: 1, userid: 1, products: testProductList };

test('Render Product component with given product', () => {
  const { getByText, getByLabelText } = render(<ProductCard product={testProduct} wishlist={testWishlist} />);
  expect(getByText(/test title/i)).toBeInTheDocument();
  expect(getByText(/€111/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();
});
