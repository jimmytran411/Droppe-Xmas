import React from 'react';
import { render } from '@testing-library/react';

import { ProductCarousel } from 'Views/Overview/ProductCarousel';
import { Product } from 'api/wishList';
import { WishlistWithProductDetail } from 'Views/WishList';
import { CartContext } from 'context/CartContext';
import { PriceContext } from 'context/PriceContext';

test('It should render Carousel with pending product', () => {
  const testApproveList: Product[] = [
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
      approvalStatus: 'pending',
    },
  ];
  const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testApproveList };
  const mockCartValue = {
    wishlists: [{ ...testCurrentWLProp }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
  };
  const mockPriceValue = {
    totalPrice: 420,
    totalDiscount: 240,
  };
  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
    </CartContext.Provider>
  );
  const { getByText, getAllByText } = render(<ProductCarousel givenStatus="pending" />, { wrapper });

  expect(getByText(/these items/i).textContent).toBe(`These items are still in your wishlists:`);
  expect(getByText(/Username_1/i)).toBeInTheDocument();

  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/€111/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/€222/i)).toBeInTheDocument();
});
