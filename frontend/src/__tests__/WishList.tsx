import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Product } from 'api/wishList';
import { WishList, WishlistWithProductDetail } from 'Views/WishList';
import { CartContext } from 'context/CartContext';
import userEvent from '@testing-library/user-event';

test('Render discard list with test input', () => {
  const testCurrentWL: Product[] = [
    {
      id: 1,
      title: 'test title 1',
      price: 111,
      description: 'test description 1',
      image: 'test img link 1',
      category: 'test category 1',
      approvalStatus: 'pending',
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
  const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testCurrentWL };
  const mockCartValue = {
    wishlists: [{ ...testCurrentWLProp }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
  };

  const history = createMemoryHistory({ initialEntries: ['/wishlist/1'] });
  const { getByText, getByLabelText } = render(
    <CartContext.Provider value={mockCartValue}>
      <Router history={history}>
        <WishList {...testCurrentWLProp} />
      </Router>
    </CartContext.Provider>
  );
  expect(getByText(/Current Cart: €222.00/i)).toBeInTheDocument();
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
});
