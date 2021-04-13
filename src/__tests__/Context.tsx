import userEvent from '@testing-library/user-event';
import { CartContext } from 'context/CartContext';
import React from 'react';
import { render } from '@testing-library/react';
import { IWishlistWithProductDetail } from 'WishLists';
import { IProduct } from 'api/wishList';
import App from 'App';

const testCurrentWL: IProduct[] = [
  {
    id: 1,
    title: 'test title 1',
    price: 111,
    description: 'test description 1',
    image: 'test img link 1',
    category: 'test category 1',
    currentState: 'pending',
  },
  {
    id: 2,
    title: 'test title 2',
    price: 222,
    description: 'test description 2',
    image: 'test img link 2',
    category: 'test category 2',
    currentState: 'approved',
  },
  {
    id: 3,
    title: 'test title 3',
    price: 333,
    description: 'test description 3',
    image: 'test img link 3',
    category: 'test category 3',
    currentState: 'discarded',
  },
];
const testCurrentWLProp: IWishlistWithProductDetail = { id: 1, userid: 1, products: testCurrentWL };
const mockValue = {
  allwishlist: [{ ...testCurrentWLProp }],
  currentWishList: { ...testCurrentWLProp },
  handleOpenWishList: jest.fn(),
  handleProduct: jest.fn(),
  updateWishList: jest.fn(),
  totalPrice: 20,
  totalPriceWithoutDiscount: 40,
  productListEmptyCheck: jest.fn(),
  currentCartPrice: 20,
  currentSaving: 20,
};

test('Test App show value from provider', () => {
  const wrapper = ({ children }: any) => <CartContext.Provider value={mockValue}>{children}</CartContext.Provider>;
  const { getByText, getByRole } = render(<App />, {
    wrapper,
  });
  expect(getByText(/Total: /i).textContent).toBe('Total: €20.00');
  expect(getByText(/Total saving: /i).textContent).toBe('Total Saving: €20.00');
  expect(getByText(/current cart: €20.00/i)).toBeInTheDocument();
  expect(getByText(/you save: €20.00/i)).toBeInTheDocument();

  userEvent.click(getByRole('button', { name: /child-1/i }));
  expect(mockValue.handleOpenWishList).toHaveBeenCalledTimes(1);

  userEvent.click(getByRole('button', { name: /approve-btn-1/i }));
  expect(mockValue.handleProduct).toHaveBeenCalledTimes(1);
  userEvent.click(getByRole('button', { name: /discard-btn-1/i }));
  expect(mockValue.handleProduct).toHaveBeenCalledTimes(2);

  userEvent.click(getByRole('button', { name: /return-btn-2/i }));
  expect(mockValue.handleProduct).toHaveBeenCalledTimes(3);
  userEvent.click(getByRole('button', { name: /discard-btn-2/i }));
  expect(mockValue.handleProduct).toHaveBeenCalledTimes(4);

  userEvent.click(getByRole('button', { name: /approve-btn-3/i }));
  expect(mockValue.handleProduct).toHaveBeenCalledTimes(5);
  userEvent.click(getByRole('button', { name: /return-btn-3/i }));
  expect(mockValue.handleProduct).toHaveBeenCalledTimes(6);

  userEvent.click(getByRole('button', { name: /save/i }));
  expect(mockValue.updateWishList).toHaveBeenCalledTimes(1);
});