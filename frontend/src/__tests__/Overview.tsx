import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Overview } from 'Views/Overview';
import { CartContext } from 'context/CartContext';
import { PriceContext } from 'context/PriceContext';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ProductDetail } from 'api/wishList';
import _ from 'lodash';
import { ProductContext } from 'context/ProductContext';

test('Test Overview show value from provider', () => {
  const history = createMemoryHistory({ initialEntries: ['/overview'] });

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

  const testWishlistProp: WishlistWithProductStatus = { wishlistId: 1, productList: testWishlist };

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

  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2, testDetail3],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const mockCartValue = {
    wishlists: [{ ...testWishlistProp }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
    handleSorting: jest.fn(),
  };
  const mockPriceValue = {
    totalPrice: 420,
    totalDiscount: 240,
  };

  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <ProductContext.Provider value={mockProductValue}>
        <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
      </ProductContext.Provider>
    </CartContext.Provider>
  );
  const { getByText, getByRole } = render(
    <Router history={history}>
      <Overview />
    </Router>,
    {
      wrapper,
    }
  );

  expect(getByText(/total:/i)).toHaveTextContent('Total: €420.00');
  expect(getByText(/you save:/i)).toHaveTextContent('You save: €240.00');
  expect(getByText(/These items are still in your wishlists:/i)).toBeInTheDocument();
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/€111/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /checkout/i })).toBeInTheDocument;
  expect(getByText('❌')).toBeInTheDocument();
});
