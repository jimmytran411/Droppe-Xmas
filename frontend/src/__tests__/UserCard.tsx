import React from 'react';
import { render } from '@testing-library/react';

import { UserCard, UserCardProps } from 'Views/Landing/UserCard';
import { BrowserRouter } from 'react-router-dom';

const testUserCard: UserCardProps = {
  userName: 'test username',
  approvedProductCount: 1,
  discardedProductCount: 2,
  pendingProductCount: 3,
  wishlistId: 1,
};

test('Render Usercard with given product', () => {
  const { getByText } = render(
    <BrowserRouter>
      <UserCard {...testUserCard} />
    </BrowserRouter>
  );
  expect(getByText(/test username/i)).toBeInTheDocument();
  expect(getByText(/1/i)).toBeInTheDocument();
  expect(getByText(/2/i)).toBeInTheDocument();
  expect(getByText(/3/i)).toBeInTheDocument();
});
