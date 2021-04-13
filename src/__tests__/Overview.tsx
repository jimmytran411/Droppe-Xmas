import React from 'react';
import { render } from '@testing-library/react';
import { IProduct } from 'api/wishList';
import { Overview } from 'Overview';
import { CartContext } from 'context/CartContext';
import { IWishlistWithProductDetail } from 'WishLists';

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

test('Test Overview show value from provider', () => {
  const wrapper = ({ children }: any) => <CartContext.Provider value={mockValue}>{children}</CartContext.Provider>;
  const { getByText, getByRole } = render(<Overview />, {
    wrapper,
  });

  expect(getByText(/total:/i).textContent).toBe('Total: €20.00');
  expect(getByText(/you save:/i).textContent).toBe('You save: €20.00');
  expect(getByText(/These items are still in your wishlists:/i)).toBeInTheDocument();
  expect(getByText(/You discard these:/i)).toBeInTheDocument();
});
