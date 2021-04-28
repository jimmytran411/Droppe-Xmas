import React from 'react';
import { render } from '@testing-library/react';
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
  const { getByText, getByLabelText } = render(<ProductCard product={testProduct} wishlist={testWishlist} />, {
    wrapper,
  });
  expect(getByText(/test title/i)).toBeInTheDocument();
  expect(getByText(/€111/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();
});
