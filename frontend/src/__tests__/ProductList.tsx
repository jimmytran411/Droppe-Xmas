import React from 'react';
import { render } from '@testing-library/react';
import { Product } from 'api/wishList';
import { ProductList, ProductListProps } from 'WishList/ProductList';
import { WishlistWithProductDetail } from 'WishList';

test('Render pending wishlist with test input', () => {
  const testPendingList: Product[] = [
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
  const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testPendingList };
  const testPendingListProp: ProductListProps = { wishlist: testCurrentWLProp, givenStatus: 'pending' };

  const { getByText, getByLabelText } = render(<ProductList {...testPendingListProp} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();
});

test('Render approve list with test input', () => {
  const testApproveList: Product[] = [
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
  ];
  const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testApproveList };
  const testApproveListProp: ProductListProps = { wishlist: testCurrentWLProp, givenStatus: 'approved' };

  const { getByText, getByLabelText } = render(<ProductList {...testApproveListProp} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/discard-btn-1/i)).toBeInTheDocument();
});

test('Render discard list with test input', () => {
  const testDiscardList: Product[] = [
    {
      id: 1,
      title: 'test title 1',
      price: 111,
      description: 'test description 1',
      image: 'test img link 1',
      category: 'test category 1',
      approvalStatus: 'discarded',
    },
    {
      id: 2,
      title: 'test title 2',
      price: 222,
      description: 'test description 2',
      image: 'test img link 2',
      category: 'test category 2',
      approvalStatus: 'discarded',
    },
  ];
  const testCurrentWLProp: WishlistWithProductDetail = { id: 1, userid: 1, products: testDiscardList };
  const testDiscardListProp: ProductListProps = { wishlist: testCurrentWLProp, givenStatus: 'discarded' };

  const { getByText, getByLabelText } = render(<ProductList {...testDiscardListProp} />);
  expect(getByText(/test title 1/i)).toBeInTheDocument();
  expect(getByText(/111/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-1/i)).toBeInTheDocument();

  expect(getByText(/test title 2/i)).toBeInTheDocument();
  expect(getByText(/222/i)).toBeInTheDocument();
  expect(getByLabelText(/approve-btn-1/i)).toBeInTheDocument();
  expect(getByLabelText(/return-btn-1/i)).toBeInTheDocument();
});
