import React from 'react';
import { render } from '@testing-library/react';
import { Product } from 'api/wishList';
import { Overview } from 'Overview';
import { CartContext } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishLists';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

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
const mockValue = {
  wishlists: [{ ...testCurrentWLProp }],
  currentWishList: { ...testCurrentWLProp },
  handleOpenWishList: jest.fn(),
  handleProduct: jest.fn(),
  updateWishList: jest.fn(),
  totalPrice: 20,
  totalDiscount: 20,
  productListEmptyCheck: jest.fn(),
  currentCartPrice: 20,
  currentSaving: 20,
  totalQuantity: jest.fn(),
  overview: [{ ...testCurrentWLProp }],
  isLoading: false,
  totalApprovedProduct: 1,
  handlePayment: jest.fn(),
};

test('Test Overview show value from provider', () => {
  const wrapper = ({ children }: any) => <CartContext.Provider value={mockValue}>{children}</CartContext.Provider>;
  const { getByText, getByRole } = render(
    <BrowserRouter>
      <Overview />
    </BrowserRouter>,
    {
      wrapper,
    }
  );

  expect(getByText(/total:/i).textContent).toBe('Total: €20.00');
  expect(getByText(/you save:/i).textContent).toBe('You save: €20.00');
  expect(getByText(/These items are still in your wishlists:/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /checkout/i })).toBeInTheDocument;
  expect(getByRole('button', { name: '⃔' })).toBeInTheDocument();
});
