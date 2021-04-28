import React from 'react';
import { render } from '@testing-library/react';
import { Product } from 'api/wishList';
import { WishlistWithProductDetail } from 'Views/WishList';
import { PaymentResult } from 'Views/Overview/PaymentResult';

const testProductList: Product[] = [
  {
    id: 1,
    title: 'test title 1',
    price: 111,
    description: 'test description 1',
    image: 'test img link 1',
    category: 'test category 1',
    approvalStatus: 'approved',
  },
  {
    id: 2,
    title: 'test title 2',
    price: 222,
    description: 'test description 2',
    image: 'test img link 2',
    category: 'test category 2',
    approvalStatus: 'approved',
  },
  {
    id: 3,
    title: 'test title 3',
    price: 333,
    description: 'test description 3',
    image: 'test img link 3',
    category: 'test category 3',
    approvalStatus: 'discarded',
  },
];
const testWL: WishlistWithProductDetail = { id: 1, userid: 1, products: testProductList };
const testPatchData = [{ ...testWL }];

test('Test render Payment result with given patchData', () => {
  const { getByText } = render(<PaymentResult {...{ patchData: testPatchData, productStatus: 'approved' }} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i).textContent).toBe('Price: €111');

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i).textContent).toBe('Price: €222');
});
