import React from 'react';
import { render, screen } from '@testing-library/react';
import _ from 'lodash';

import { ProductCarousel } from 'Views/Overview/ProductCarousel';
import { CartContext } from 'context/CartContext';
import { PriceContext } from 'context/PriceContext';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ProductContext } from 'context/ProductContext';
import { ProductDetail } from 'api/wishList';

test('It should render Carousel with pending product', () => {
  const testApproveList: ProductWithStatus[] = [
    {
      productId: 1,
      approvalStatus: 'pending',
    },
    {
      productId: 2,
      approvalStatus: 'pending',
    },
  ];
  const testDetail1: ProductDetail = {
    id: 1,
    title: 'test title 1',
    price: 111,
    description: 'test description 1',
    image: 'test img link 1',
    category: 'test category 1',
  };
  const testDetail2: ProductDetail = {
    id: 2,
    title: 'test title 2',
    price: 222,
    description: 'test description 2',
    image: 'test img link 2',
    category: 'test category 2',
  };

  const mockGetProductFromContext = (id: number) => {
    return _.find(mockProductValue.productDetailList, (product) => product.id === id);
  };

  const testWishlistProps: WishlistWithProductStatus = { wishlistId: 1, productList: testApproveList };

  const mockCartValue = {
    wishlists: [{ ...testWishlistProps }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
    handleSorting: jest.fn(),
  };

  const mockPriceValue = {
    totalPrice: 420,
    totalDiscount: 240,
    getProductPrice: jest.fn(),
  };

  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <ProductContext.Provider value={mockProductValue}>
        <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
      </ProductContext.Provider>
    </CartContext.Provider>
  );
  render(<ProductCarousel givenStatus="pending" />, { wrapper });

  expect(screen.getByText(/these items/i)).toHaveTextContent(`These items are still in your wishlists:`);
  expect(screen.getByText(/Username_1/i)).toBeInTheDocument();

  expect(screen.getByText(/test title 1/i)).toBeInTheDocument();
  expect(screen.getByText(/€111/i)).toBeInTheDocument();

  expect(screen.getByText(/test title 2/i)).toBeInTheDocument();
  expect(screen.getByText(/€222/i)).toBeInTheDocument();
});
