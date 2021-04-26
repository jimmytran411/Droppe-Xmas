import * as React from 'react';

import { getProduct, Product, WishList, WishListProduct, getWishLists } from 'api/wishList';
import { ApprovalStatus, Loading } from 'common/commonType';
import { WishlistWithProductDetail } from 'WishList';

export interface Cart {
  wishlists: WishlistWithProductDetail[];
  handleProduct: (product: Product, updatedState: ApprovalStatus, wishListOfProduct: WishlistWithProductDetail) => void;
  handlePayment: () => void;
}

const initialCartValue: Cart = {
  wishlists: [],
  handleProduct: () => {},
  handlePayment: () => {},
};
const CartContext = React.createContext<Cart>(initialCartValue);
function CartProvider(props: any) {
  const [wishlists, setWishlists] = React.useState<WishlistWithProductDetail[]>([]);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        const { data } = await getWishLists();

        const productIds: number[] = [];
        data.forEach((wishlist) => {
          wishlist.products.forEach((product) => {
            productIds.indexOf(product.productId) === -1 && productIds.push(product.productId);
          });
        });

        const detailProductList = await Promise.all(
          productIds.map(async (id) => {
            return await getProduct(id);
          })
        );

        const wishlistsWithProductDetail: WishlistWithProductDetail[] = data.map((wishlist: WishList) => {
          const details = wishlist.products.map(({ productId }: WishListProduct) => {
            const detailProduct = detailProductList.find((product) => product.id === productId);
            return detailProduct ? detailProduct : 'loading';
          });

          return { id: wishlist.id, userid: wishlist.userId, products: details };
        });

        setWishlists(wishlistsWithProductDetail);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllWishList();
  }, []);

  const handleProduct = (
    handledProduct: Product,
    updatedStatus: ApprovalStatus,
    wishListOfProduct: WishlistWithProductDetail
  ) => {
    const updateProductList: (Product | Loading)[] = wishListOfProduct.products.map(
      (prevProduct: Product | Loading) => {
        const updatedProduct: Product | Loading =
          prevProduct !== 'loading' ? { ...prevProduct, approvalStatus: updatedStatus } : 'loading';
        if (prevProduct !== 'loading') {
          return prevProduct.id === handledProduct.id ? updatedProduct : prevProduct;
        } else {
          return 'loading';
        }
      }
    );
    const updatedWishlist: WishlistWithProductDetail = { ...wishListOfProduct, products: updateProductList };
    const updatedAllWishlist: WishlistWithProductDetail[] = wishlists.map((wishlist: WishlistWithProductDetail) => {
      return wishlist.id === updatedWishlist.id ? updatedWishlist : wishlist;
    });
    setWishlists(updatedAllWishlist);
  };

  const handlePayment = () => {
    // Set approvalstatus of all product to pending
    setWishlists((prev: WishlistWithProductDetail[]) => {
      const resetWishlists: WishlistWithProductDetail[] = prev.map((wishlist: WishlistWithProductDetail) => {
        const productList = wishlist.products.map((product: Product | Loading) => {
          const resetStateProduct: Product | Loading =
            product !== 'loading' ? { ...product, approvalStatus: 'pending' } : 'loading';
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
