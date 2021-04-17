import { getProduct, Product, WishList, WishListProduct, getWishLists } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import * as React from 'react';
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
        const wishlistsWithProductDetail = await Promise.all(
          data.map(async (wishlist: WishList) => {
            const details = await Promise.all(
              wishlist.products.map(async ({ productId }: WishListProduct) => {
                const product = await getProduct(productId);
                return product;
              })
            );

            return { id: wishlist.id, userid: wishlist.userId, products: details };
          })
        );
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
    const updateProductList: Product[] = wishListOfProduct.products.map((prevProduct: Product) => {
      const updatedProduct: Product = { ...prevProduct, approvalStatus: updatedStatus };
      return prevProduct.id === handledProduct.id ? updatedProduct : prevProduct;
    });
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
        const productList = wishlist.products.map((product: Product) => {
          const resetStateProduct: Product = { ...product, approvalStatus: 'pending' };
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
