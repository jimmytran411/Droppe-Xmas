import React, { useEffect, useState } from 'react';

import { useCart } from 'context/CartContext';
import { ProductDetail } from 'api/wishList';
import { useSort } from 'context/SortContext';

interface SortButtonProps {
  detailList: ProductDetail[];
  wishlistId: number;
}

export const SortButton: React.FC<SortButtonProps> = ({ detailList, wishlistId }: SortButtonProps) => {
  const { toggleSort, sortState } = useSort();
  const { handleSorting } = useCart();

  const [sortLabel, setSortLabel] = useState('Default');

  const handleSort = () => {
    handleSorting({ type: sortState, payload: { detailList, wishlistId } });
    toggleSort();
  };
  useEffect(() => {
    switch (sortState) {
      case 'SORT_BY_CHEAPEST':
        setSortLabel('Cheapest');
        break;
      case 'SORT_BY_MOST_EXPENSIVE':
        setSortLabel('Most Expensive');
        break;
      default:
        throw new Error(`${sortState} not found`);
    }
    detailList.length && handleSorting({ type: sortState, payload: { detailList, wishlistId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState, detailList, wishlistId]);

  return (
    <span className="wishlist-sorting">
      <button disabled={detailList.length ? false : true} onClick={handleSort}>
        {sortLabel}
      </button>
    </span>
  );
};
