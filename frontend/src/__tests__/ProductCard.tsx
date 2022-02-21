import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../Views/WishList/ProductCard';
import { ProductDetail } from 'api/wishList';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ProductContext } from 'context/ProductContext';

const testProduct: ProductWithStatus = {
  productId: 1,
  approvalStatus: 'pending',
};
const testProductList: ProductWithStatus[] = [testProduct];
const testWishlist: WishlistWithProductStatus = { wishlistId: 1, productList: testProductList };
const testDetail: ProductDetail = {
  id: 1,
  title: 'test title',
  price: 111,
  description: 'test description',
  image: 'test img link',
  category: 'test category',
};
const mockProductValue = {
  productDetailList: [testDetail],
  updateProductDetailList: jest.fn(),
  getProductFromContext: () => testDetail,
};

const wrapper = ({ children }: any) => (
  <ProductContext.Provider value={mockProductValue}>{children}</ProductContext.Provider>
);

test('Render Product component with given product', () => {
  render(<ProductCard product={testProduct} wishlist={testWishlist} />, {
    wrapper,
  });
  expect(screen.getByText(/test title/i)).toBeInTheDocument();
  expect(screen.getByText(/€111/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/discard-btn-1/i)).toBeInTheDocument();
});
