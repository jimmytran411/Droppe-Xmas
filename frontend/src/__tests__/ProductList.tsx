import React from 'react';
import { render } from '@testing-library/react';
import * as _ from 'lodash';

import { ProductList, ProductListProps } from 'Views/WishList/ProductList';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ProductDetail } from 'api/wishList';
import { ProductContext } from 'context/ProductContext';

test('Render pending wishlist with test input', () => {
  const testPendingList: ProductWithStatus[] = [
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
  const testWishlist: WishlistWithProductStatus = { wishlistId: 1, productList: testPendingList };
  const testPendingListProp: ProductListProps = { wishlist: testWishlist, givenStatus: 'pending' };

  const mockGetProductFromContext = (id: number) => {
    return _.find(mockProductValue.productDetailList, (product) => product.id === id);
  };

  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const wrapper = ({ children }: any) => (
    <ProductContext.Provider value={mockProductValue}>{children}</ProductContext.Provider>
  );

  const { getByText, getByLabelText } = render(<ProductList {...testPendingListProp} />, { wrapper });
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-2/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-2/i)).toBeInTheDocument();
});

test('Render approve list with test input', () => {
  const testApprovedList: ProductWithStatus[] = [
    {
      productId: 1,
      approvalStatus: 'approved',
    },
    {
      productId: 2,
      approvalStatus: 'approved',
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
  const testWishlist: WishlistWithProductStatus = { wishlistId: 1, productList: testApprovedList };
  const testApprovedListProps: ProductListProps = { wishlist: testWishlist, givenStatus: 'approved' };

  const mockGetProductFromContext = (id: number) => {
    return _.find(mockProductValue.productDetailList, (product) => product.id === id);
  };

  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const wrapper = ({ children }: any) => (
    <ProductContext.Provider value={mockProductValue}>{children}</ProductContext.Provider>
  );

  const { getByText, getByLabelText } = render(<ProductList {...testApprovedListProps} />, { wrapper });
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-2/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-2/i)).toBeInTheDocument();
});

test('Render discard list with test input', () => {
  const testDiscardedList: ProductWithStatus[] = [
    {
      productId: 1,
      approvalStatus: 'discarded',
    },
    {
      productId: 2,
      approvalStatus: 'discarded',
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
  const testWishlist: WishlistWithProductStatus = { wishlistId: 1, productList: testDiscardedList };
  const testDiscardedListProps: ProductListProps = { wishlist: testWishlist, givenStatus: 'discarded' };

  const mockGetProductFromContext = (id: number) => {
    return _.find(mockProductValue.productDetailList, (product) => product.id === id);
  };

  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const wrapper = ({ children }: any) => (
    <ProductContext.Provider value={mockProductValue}>{children}</ProductContext.Provider>
  );

  const { getByText, getByLabelText } = render(<ProductList {...testDiscardedListProps} />, { wrapper });
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-2/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-2/i)).toBeInTheDocument();
});
