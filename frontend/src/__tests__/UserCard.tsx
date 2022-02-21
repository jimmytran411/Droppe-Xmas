import React from 'react';
import { render, screen } from '@testing-library/react';

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
  render(
    <BrowserRouter>
      <UserCard {...testUserCard} />
    </BrowserRouter>
  );
  expect(screen.getByText(/test username/i)).toBeInTheDocument();
  expect(screen.getByText(/1/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();
  expect(screen.getByText(/3/i)).toBeInTheDocument();
});
