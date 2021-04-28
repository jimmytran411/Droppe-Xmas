import * as React from 'react';

import { getWishLists } from 'api/wishList';
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
}

const initialCartValue: Cart = {
  wishlists: [],
  handleProduct: () => {},
  handlePayment: () => {},
};
const CartContext = React.createContext<Cart>(initialCartValue);
function CartProvider(props: any) {
  const [wishlists, setWishlists] = React.useState<WishlistWithProductStatus[]>([]);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
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
        setWishlists(wishlists);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllWishList();
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
    const updatedAllWishlist: WishlistWithProductStatus[] = wishlists.map((wishlist: WishlistWithProductStatus) => {
      return wishlist.wishlistId === updatedWishlist.wishlistId ? updatedWishlist : wishlist;
    });
    setWishlists(updatedAllWishlist);
  };

  const handlePayment = () => {
    // Set approvalstatus of all product to pending
    setWishlists((prev: WishlistWithProductStatus[]) => {
      const resetWishlists: WishlistWithProductStatus[] = prev.map((wishlist: WishlistWithProductStatus) => {
        const productList = wishlist.productList.map((product: ProductWithStatus) => {
          const resetStateProduct: ProductWithStatus = { ...product, approvalStatus: 'pending' };
          return resetStateProduct;
        });
        return { ...wishlist, products: productList };
      });
      return resetWishlists;
    });
  };

  return (
    <CartContext.Provider
      value={{
        wishlists,
        handleProduct,
        handlePayment,
      }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
