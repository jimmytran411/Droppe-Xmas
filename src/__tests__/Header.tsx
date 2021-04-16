import React from 'react';
import { render } from '@testing-library/react';
import { IProduct } from 'api/wishList';
import { CartContext } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishLists';
import { Header } from 'Header';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

const testCurrentWL: IProduct[] = [
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
  wishlists: [
    { ...testCurrentWLProp },
    { ...testCurrentWLProp, id: 2, userid: 2 },
    { ...testCurrentWLProp, id: 3, userid: 3 },
  ],
  currentWishList: { ...testCurrentWLProp },
  handleOpenWishList: jest.fn(),
  handleProduct: jest.fn(),
  updateWishList: jest.fn(),
  totalPrice: 20,
  totalDiscount: 20,
  productListEmptyCheck: jest.fn(),
  currentCartPrice: 20,
  currentSaving: 20,
  allWishlistDuplicateCount: jest.fn(),
};
test('Test Overview show value from provider', () => {
  const wrapper = ({ children }: any) => <CartContext.Provider value={mockValue}>{children}</CartContext.Provider>;
  const { getByText, getByRole } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
    {
      wrapper,
    }
  );
  const totalPrice = getByText(/total:/i);
  expect(totalPrice.textContent).toBe('Total: €20.00');

  const saving = getByText(/total saving:/i);
  expect(saving.textContent).toBe('Total Saving: €20.00');

  // userEvent.click(getByRole('button', { name: /child-1/i }));
  // expect(mockValue.handleOpenWishList).toHaveBeenCalledTimes(1);

  // userEvent.click(getByRole('button', { name: /child-2/i }));
  // expect(mockValue.handleOpenWishList).toHaveBeenCalledTimes(2);

  // userEvent.click(getByRole('button', { name: /child-3/i }));
  // expect(mockValue.handleOpenWishList).toHaveBeenCalledTimes(3);

  // const checkoutBtn = getByRole('button', { name: /checkout/i });
  // userEvent.click(checkoutBtn);
  // expect(checkoutBtn).not.toBeInTheDocument();
  // expect(totalPrice).not.toBeInTheDocument();
  // expect(saving).not.toBeInTheDocument();
});
