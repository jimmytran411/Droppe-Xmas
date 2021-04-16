import { getProduct, IProduct, WishList, WishListProduct, getWishLists } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import * as React from 'react';
import { CountTotalProductWithGivenState } from 'utils/wishlistAndProduct';
import { WishlistWithProductDetail } from 'WishLists';

export interface Cart {
  wishlists: WishlistWithProductDetail[];
  handleProduct: (
    product: IProduct,
    updatedState: ApprovalStatus,
    wishListOfProduct: WishlistWithProductDetail
  ) => void;
  totalQuantity: (product: IProduct) => number;
  totalApprovedProduct: number;
  handlePayment: () => void;
}

const initialCartValue: Cart = {
  wishlists: [],
  handleProduct: () => {},
  totalQuantity: () => 0,
  totalApprovedProduct: 0,
  handlePayment: () => {},
};
const CartContext = React.createContext<Cart>(initialCartValue);
function CartProvider(props: any) {
  const [wishlists, setWishlists] = React.useState<WishlistWithProductDetail[]>([]);
  const [totalApprovedProduct, setTotalApprovedProduct] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        const { data } = await getWishLists();
        const allWLWithDetailedProduct = data.map((wishlist: WishList) => {
          const detailedProducts: IProduct[] = [];
          wishlist.products.forEach(async ({ productId }: WishListProduct) => {
            const product = await getProduct(productId);
            detailedProducts.push(product);
          });
          return { id: wishlist.id, userid: wishlist.userId, products: detailedProducts };
        });
        setWishlists(allWLWithDetailedProduct);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllWishList();
  }, []);

  const handleProduct = (
    handledProduct: IProduct,
    updatedStatus: ApprovalStatus,
    wishListOfProduct: WishlistWithProductDetail
  ) => {
    // Update AllWishlist , CurrentWishList
    const updateProductList: IProduct[] = wishListOfProduct.products.map((prevProduct: IProduct) => {
      const updatedProduct: IProduct = { ...prevProduct, approvalStatus: updatedStatus };
      return prevProduct.id === handledProduct.id ? updatedProduct : prevProduct;
    });
    const updatedWishlist: WishlistWithProductDetail = { ...wishListOfProduct, products: updateProductList };
    const updatedAllWishlist: WishlistWithProductDetail[] = wishlists.map((wishlist: WishlistWithProductDetail) => {
      return wishlist.id === updatedWishlist.id ? updatedWishlist : wishlist;
    });

    const updatedTotalApprovedProduct = CountTotalProductWithGivenState(updatedAllWishlist, 'approved');
    setTotalApprovedProduct(updatedTotalApprovedProduct);

    setWishlists(updatedAllWishlist);
  };

  const totalQuantity = (productToCheck: IProduct, wishlistOfProduct: WishlistWithProductDetail) => {
    let quantity = 1;
    wishlists &&
      wishlistOfProduct &&
      wishlists.forEach(({ products, id }: WishlistWithProductDetail) => {
        products.forEach((product: IProduct) => {
          product.id === productToCheck.id && wishlistOfProduct.id !== id && quantity++;
        });
      });
    return quantity === 1 ? 1 : quantity;
  };

  const handlePayment = () => {
    // Reset allprice, cart, and change state of all product to pending
    setWishlists((prev: WishlistWithProductDetail[]) => {
      const resetWishlists: WishlistWithProductDetail[] = prev.map((wishlist: WishlistWithProductDetail) => {
        const productList = wishlist.products.map((product: IProduct) => {
          const resetStateProduct: IProduct = { ...product, approvalStatus: 'pending' };
          return resetStateProduct;
        });
        return { ...wishlist, products: productList };
      });
      return resetWishlists;
    });
    setTotalApprovedProduct(0);
  };

  return (
    <CartContext.Provider
      value={{
        wishlists,
        handleProduct,
        totalQuantity,
        totalApprovedProduct,
        handlePayment,
      }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
