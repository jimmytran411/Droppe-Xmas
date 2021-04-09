import React from 'react';
import { render } from '@testing-library/react';
import { IProduct } from 'api/wishList';
import { IProductList, ProductList } from 'WishLists/ProductList';

test('Render pending wishlist with test input', () => {
  const testPendingList: IProduct[] = [
    {
      id: 1,
      title: 'test title 1',
      price: 'test price 1',
      description: 'test description 1',
      image: 'test img link 1',
      category: 'test category 1',
      currentState: 'pending',
    },
    {
      id: 2,
      title: 'test title 2',
      price: 'test price 2',
      description: 'test description 2',
      image: 'test img link 2',
      category: 'test category 2',
      currentState: 'pending',
    },
  ];
  const testPendingListProp: IProductList = { productList: testPendingList, productCurrentState: 'pending' };

  const { getByText, getByRole } = render(<ProductList {...testPendingListProp} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/test price 1/i)).toBeInTheDocument();
  expect(getByText(/test description 1/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-1/i })).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/test price 2/i)).toBeInTheDocument();
  expect(getByText(/test description 2/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-1/i })).toBeInTheDocument();
});

test('Render approve list with test input', () => {
  const testApproveList: IProduct[] = [
    {
      id: 1,
      title: 'test title 1',
      price: 'test price 1',
      description: 'test description 1',
      image: 'test img link 1',
      category: 'test category 1',
      currentState: 'approved',
    },
    {
      id: 2,
      title: 'test title 2',
      price: 'test price 2',
      description: 'test description 2',
      image: 'test img link 2',
      category: 'test category 2',
      currentState: 'approved',
    },
  ];
  const testApproveListProp: IProductList = { productList: testApproveList, productCurrentState: 'approved' };

  const { getByText, getByRole } = render(<ProductList {...testApproveListProp} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/test price 1/i)).toBeInTheDocument();
  expect(getByText(/test description 1/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-1/i })).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/test price 2/i)).toBeInTheDocument();
  expect(getByText(/test description 2/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /discard-btn-1/i })).toBeInTheDocument();
});

test('Render discard list with test input', () => {
  const testDiscardList: IProduct[] = [
    {
      id: 1,
      title: 'test title 1',
      price: 'test price 1',
      description: 'test description 1',
      image: 'test img link 1',
      category: 'test category 1',
      currentState: 'discarded',
    },
    {
      id: 2,
      title: 'test title 2',
      price: 'test price 2',
      description: 'test description 2',
      image: 'test img link 2',
      category: 'test category 2',
      currentState: 'discarded',
    },
  ];
  const testDiscardListProp: IProductList = { productList: testDiscardList, productCurrentState: 'discarded' };

  const { getByText, getByRole } = render(<ProductList {...testDiscardListProp} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/test price 1/i)).toBeInTheDocument();
  expect(getByText(/test description 1/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-1/i })).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/test price 2/i)).toBeInTheDocument();
  expect(getByText(/test description 2/i)).toBeInTheDocument();
  expect(getByRole('button', { name: /approve-btn-1/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /return-btn-1/i })).toBeInTheDocument();
});
