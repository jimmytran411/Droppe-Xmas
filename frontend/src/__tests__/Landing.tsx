import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Landing } from 'Views/Landing/Landing';
import { CartContext } from 'context/CartContext';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';

test('Render discard list with test input', () => {
  const testWishlist: ProductWithStatus[] = [
    {
      productId: 1,
      approvalStatus: 'pending',
    },
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
    {
      productId: 3,
      approvalStatus: 'discarded',
    },
    {
      productId: 3,
      approvalStatus: 'discarded',
    },
  ];
  const testWishlistProp: WishlistWithProductStatus = { wishlistId: 1, productList: testWishlist };
  const mockCartValue = {
    wishlists: [{ ...testWishlistProp }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
    handleSorting: jest.fn(),
  };

  const history = createMemoryHistory({ initialEntries: ['/'] });
  const wrapper = ({ children }: any) => <CartContext.Provider value={mockCartValue}>{children}</CartContext.Provider>;

  const { getByText } = render(
    <Router history={history}>
      <Landing />
    </Router>,
    { wrapper }
  );
  expect(getByText(/user's wishlist/i)).toBeInTheDocument();
  expect(getByText(/username_1/i)).toBeInTheDocument();
  expect(getByText(/approved/i)).toBeInTheDocument();

  expect(getByText(/discarded/i)).toBeInTheDocument();
  expect(getByText(/3/i)).toBeInTheDocument();

  expect(getByText(/pending/i)).toBeInTheDocument();
  expect(getByText(/2/i)).toBeInTheDocument();
});
