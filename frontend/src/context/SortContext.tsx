import * as React from 'react';

export interface Sorting {
  sortState: string;
  toggleSort: () => void;
}

const initialSortValue: Sorting = {
  sortState: 'SORT_BY_CHEAPEST',
  toggleSort: () => null,
};

const SortContext = React.createContext<Sorting>(initialSortValue);
const SortProvider = (props: any) => {
  const [sortState, setSortState] = React.useState('SORT_BY_CHEAPEST');

  const toggleSort = () => {
    const stateList = ['SORT_BY_CHEAPEST', 'SORT_BY_MOST_EXPENSIVE'];
    const index = stateList.indexOf(sortState);
    index === stateList.length - 1 ? setSortState(stateList[0]) : setSortState(stateList[index + 1]);
  };

  return <SortContext.Provider value={{ sortState, toggleSort }} {...props} />;
};
const useSort = () => React.useContext(SortContext);

export { SortProvider, useSort, SortContext };
