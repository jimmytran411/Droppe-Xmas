import React from 'react';
import { render } from '@testing-library/react';

import { PaymentResult } from 'Views/Overview/PaymentResult';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ProductDetail } from 'api/wishList';
import { ProductContext } from 'context/ProductContext';
import _ from 'lodash';

const testProductList: ProductWithStatus[] = [
  {
    productId: 1,
    approvalStatus: 'approved',
  },
  {
    productId: 2,
    approvalStatus: 'approved',
  },
];
const testWL: WishlistWithProductStatus = { wishlistId: 1, productList: testProductList };

const testPatchData = [{ ...testWL }];

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

const mockProductValue = {
  productDetailList: [testDetail1, testDetail2],
  updateProductDetailList: jest.fn(),
  getProductFromContext: mockGetProductFromContext,
};

const wrapper = ({ children }: any) => (
  <ProductContext.Provider value={mockProductValue}>{children}</ProductContext.Provider>
);

test('Test render Payment result with given patchData', () => {
  const { getByText } = render(<PaymentResult {...{ patchData: testPatchData, givenStatus: 'approved' }} />, {
    wrapper,
  });
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toHaveTextContent('€111');

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toHaveTextContent('€222');
});
