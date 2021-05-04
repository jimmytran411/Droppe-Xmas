import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import _ from 'lodash';
import userEvent from '@testing-library/user-event';

import { CartContext } from 'context/CartContext';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { WishList } from 'Views/WishList';
import { ProductDetail } from 'api/wishList';
import { ProductContext } from 'context/ProductContext';

test('Render discard list with test input', () => {
  const testWishlist: ProductWithStatus[] = [
    {
      productId: 1,
      approvalStatus: 'pending',
    },
    {
      productId: 2,
      approvalStatus: 'approved',
    },
    {
      productId: 3,
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
  const testDetail3: ProductDetail = {
    id: 3,
    title: 'test title 3',
    price: 333,
    description: 'test description 3',
    image: 'test img link 3',
    category: 'test category 3',
  };

  const mockGetProductFromContext = (id: number) => {
    return _.find(mockProductValue.productDetailList, (product) => product.id === id);
  };
  const testWishlistProp: WishlistWithProductStatus = { wishlistId: 1, productList: testWishlist };
  const mockCartValue = {
    wishlists: [{ ...testWishlistProp }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
    handleSorting: jest.fn(),
  };
  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2, testDetail3],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const history = createMemoryHistory({ initialEntries: ['/wishlist/1'] });
  const { getByText, getByLabelText } = render(
    <ProductContext.Provider value={mockProductValue}>
      <CartContext.Provider value={mockCartValue}>
        <Router history={history}>
          <WishList {...testWishlistProp} />
        </Router>
      </CartContext.Provider>
    </ProductContext.Provider>
  );
  expect(getByText(/Current Wishlist: €222.00/i)).toBeInTheDocument();
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/€111/i)).toBeInTheDocument();
  userEvent.click(getByLabelText(/approve-btn-1/i));
  expect(mockCartValue.handleProduct).toHaveBeenCalledTimes(1);
  userEvent.click(getByLabelText(/discard-btn-2/i));
  expect(mockCartValue.handleProduct).toHaveBeenCalledTimes(2);

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  userEvent.click(getByLabelText(/return-btn-2/i));
  expect(mockCartValue.handleProduct).toHaveBeenCalledTimes(3);
  userEvent.click(getByLabelText(/discard-btn-2/i));
  expect(mockCartValue.handleProduct).toHaveBeenCalledTimes(4);

  expect(getByText(/test title 3/i)).toBeInTheDocument();
  expect(getByText(/€333/i)).toBeInTheDocument();
  userEvent.click(getByLabelText(/return-btn-3/i));
  expect(mockCartValue.handleProduct).toHaveBeenCalledTimes(5);
  userEvent.click(getByLabelText(/approve-btn-3/i));
  expect(mockCartValue.handleProduct).toHaveBeenCalledTimes(6);
  expect(mockCartValue.handleSorting).toHaveBeenCalledTimes(1);
});
