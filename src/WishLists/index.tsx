import React, { useEffect, useState } from 'react';
import { WishList } from './WishList';
import { getAllWishLists, IWishList } from '../api/wishList';

export const AllWishLists = () => {
  const [loading, setLoading] = useState<true | false>();
  const [wishLists, setWishLists] = useState<[IWishList]>();
  const [activeWishList, setActiveWishList] = useState<IWishList>();

  useEffect(() => {
    const fetchWishLists = async () => {
      try {
        setLoading(true);
        const { data } = await getAllWishLists();
        setWishLists(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWishLists();
  }, []);

  return (
    <div>
      {loading && <p>Loading ...</p>}
      {wishLists &&
        wishLists.map((wishList: IWishList, index: number) => {
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                setActiveWishList(wishList);
              }}
            >
              {wishList.id}
            </button>
          );
        })}
      {activeWishList && <WishList {...activeWishList} />}
    </div>
  );
};
