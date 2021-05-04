import * as React from 'react';
import _ from 'lodash';

import { getWishLists, ProductDetail } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import { WishlistWithProductStatus, ProductWithStatus } from 'common/commonInterface';

export interface Cart {
  wishlists: WishlistWithProductStatus[];
  handleProduct: (
    product: ProductWithStatus,
    updatedState: ApprovalStatus,
    wishListOfProduct: WishlistWithProductStatus
  ) => void;
  handlePayment: () => void;
  handleSorting: (...args: any) => void;
}

const initialCartValue: Cart = {
  wishlists: [],
  handleProduct: () => {},
  handlePayment: () => {},
  handleSorting: () => {},
};

const CartContext = React.createContext<Cart>(initialCartValue);

const sortProductListByGivenOrder = (productList: ProductWithStatus[], order: ProductDetail[]) => {
  const result: ProductWithStatus[] = [];
  order.forEach((product) => {
    const filterProduct = productList.filter(({ productId }) => productId === product.id);
    result.push(...filterProduct);
  });
  return result;
};

const wishlistsReducer = (state: WishlistWithProductStatus[], action: any) => {
  switch (action.type) {
    case 'FETCH_WISHLISTS': {
      return action.payload;
    }

    case 'UPDATE_WISHLISTS': {
      return state.map((wishlist: WishlistWithProductStatus) => {
        return wishlist.wishlistId === action.payload.wishlistId ? action.payload : wishlist;
      });
    }

    case 'RESET_WISHLISTS': {
      return state.map((wishlist: WishlistWithProductStatus) => {
        const productList = wishlist.productList.map((product: ProductWithStatus) => {
          const resetStateProduct: ProductWithStatus = { ...product, approvalStatus: 'pending' };
          return resetStateProduct;
        });
        return { ...wishlist, productList: productList };
      });
    }

    case 'SORT_BY_CHEAPEST': {
      const sortedDetailList = _.orderBy(action.payload, (product) => product.price);
      const sortedWishlists: WishlistWithProductStatus[] = state.map((wishlist) => {
        const sortedList = sortProductListByGivenOrder(wishlist.productList, sortedDetailList);
        console.log(sortedList);
        return { ...wishlist, productList: sortedList };
      });
      return state;
    }

    case 'SORT_BY_MOST_EXPENSIVE': {
      const sortedDetailList = _.orderBy(action.payload, (product) => product.price, ['desc']);
      const sortedWishlists: WishlistWithProductStatus[] = state.map((wishlist) => {
        const sortedList = sortProductListByGivenOrder(wishlist.productList, sortedDetailList);
        return { ...wishlist, productList: sortedList };
      });

      return sortedWishlists;
    }

    default:
      throw new Error('Action not found');
  }
};

function CartProvider(props: any) {
  const [state, dispatch] = React.useReducer(wishlistsReducer, []);

  React.useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const { data } = await getWishLists();

        const wishlists: WishlistWithProductStatus[] = data.map((wishlist) => {
          const productListWithProductStatus: ProductWithStatus[] = wishlist.products.map((product) => {
            const productWithStatus: ProductWithStatus = {
              productId: product.productId,
              approvalStatus: 'pending',
            };
            return productWithStatus;
          });

          const wishlistWithProductStatus: WishlistWithProductStatus = {
            wishlistId: wishlist.id,
            productList: productListWithProductStatus,
          };
          return wishlistWithProductStatus;
        });

        dispatch({ type: 'FETCH_WISHLISTS', payload: wishlists });
      } catch (error) {
        console.log(error);
      }
    };
    fetchWishlists();
  }, []);

  const handleProduct = (
    handledProduct: ProductWithStatus,
    updatedStatus: ApprovalStatus,
    wishListOfProduct: WishlistWithProductStatus
  ) => {
    const updateProductList: ProductWithStatus[] = wishListOfProduct.productList.map(
      (prevProduct: ProductWithStatus) => {
        const updatedProduct: ProductWithStatus = { ...prevProduct, approvalStatus: updatedStatus };

        return prevProduct.productId === handledProduct.productId ? updatedProduct : prevProduct;
      }
    );

    const updatedWishlist: WishlistWithProductStatus = { ...wishListOfProduct, productList: updateProductList };

    dispatch({ type: 'UPDATE_WISHLISTS', payload: updatedWishlist });
  };

  const handlePayment = () => {
    dispatch({ type: 'RESET_WISHLISTS' });
  };

  const handleSorting = ({ type, payload }: any) => {
    dispatch({ type, payload });
  };

  return (
    <CartContext.Provider
      value={{
        wishlists: state,
        handleProduct,
        handlePayment,
        handleSorting,
      }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
