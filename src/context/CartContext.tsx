import { getProduct, IProduct, WishList, WishListProduct, getWishLists } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import * as React from 'react';
import { totalDiscountCal, totalPriceCal, wishlistPriceCal } from 'utils/priceCalculation';
import { CountTotalProductWithGivenState } from 'utils/wishlistAndProduct';
import { WishlistWithProductDetail } from 'WishLists';

export interface ICart {
  wishlists: WishlistWithProductDetail[];
  currentWishList: WishlistWithProductDetail | undefined;
  handleOpenWishList: (wishlist: WishlistWithProductDetail) => void;
  currentCartPrice: number;
  currentSaving: number;
  totalPrice: number;
  totalDiscount: number;
  handleProduct: (
    product: IProduct,
    updatedState: ApprovalStatus,
    wishListOfProduct: WishlistWithProductDetail
  ) => void;
  productListEmptyCheck: (product: IProduct[], givenState: ApprovalStatus) => boolean;
  totalQuantity: (product: IProduct) => number;
  totalApprovedProduct: number;
  handlePayment: () => void;
}

const initialCartValue: ICart = {
  wishlists: [],
  currentWishList: undefined,
  handleOpenWishList: () => {},
  currentCartPrice: 0,
  currentSaving: 0,
  totalPrice: 0,
  totalDiscount: 0,
  handleProduct: () => {},
  productListEmptyCheck: () => false,
  totalQuantity: () => 0,
  totalApprovedProduct: 0,
  handlePayment: () => {},
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [wishlists, setWishlists] = React.useState<WishlistWithProductDetail[]>([]);
  const [currentWishList, setCurrentWishList] = React.useState<WishlistWithProductDetail>();
  const [currentCartPrice, setCurrentCartPrice] = React.useState<number>(0);
  const [currentSaving, setCurrentSaving] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [totalDiscount, setTotalDiscount] = React.useState<number>(0);
  const [totalApprovedProduct, setTotalApprovedProduct] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        const { data } = await getWishLists();
        const allWLWithDetailedProduct = data.map((wishlist: WishList) => {
          // this method to prevent Promise return type
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

  const handleOpenWishList = (wishlist: WishlistWithProductDetail) => {
    setCurrentWishList(wishlist);
    const { priceAfterDiscount, totalDiscount } = wishlistPriceCal(wishlist, wishlists);
    setCurrentSaving(totalDiscount);
    setCurrentCartPrice(priceAfterDiscount);
  };

  // product's state change => change in:
  //    allwishlist, currentwishlist, currentCartPrice, currentSaving, totalPrice, totalSaving
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

    const { totalDiscount, priceAfterDiscount } = wishlistPriceCal(updatedWishlist, updatedAllWishlist);
    setCurrentCartPrice(priceAfterDiscount);
    setCurrentSaving(totalDiscount);

    const updatedTotalPrice = totalPriceCal(updatedAllWishlist);
    setTotalPrice(updatedTotalPrice);

    const updatedTotalDiscount = totalDiscountCal(updatedAllWishlist);
    setTotalDiscount(updatedTotalDiscount);

    const updatedTotalApprovedProduct = CountTotalProductWithGivenState(updatedAllWishlist, 'approved');
    setTotalApprovedProduct(updatedTotalApprovedProduct);

    setWishlists(updatedAllWishlist);
    setCurrentWishList(updatedWishlist);
  };

  const productListEmptyCheck = (productList: IProduct[], givenState: ApprovalStatus) => {
    const productListcheck = productList.filter((product: IProduct) => product.approvalStatus === givenState);
    return productListcheck.length ? false : true;
  };

  const totalQuantity = (productToCheck: IProduct) => {
    let quantity = 1;
    wishlists &&
      currentWishList &&
      wishlists.forEach(({ products, id }: WishlistWithProductDetail) => {
        products.forEach((product: IProduct) => {
          product.id === productToCheck.id && currentWishList.id !== id && quantity++;
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
    setTotalPrice(0);
    setTotalApprovedProduct(0);
    setTotalDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        wishlists,
        currentWishList,
        handleOpenWishList,
        handleProduct,
        currentCartPrice,
        currentSaving,
        totalPrice,
        totalDiscount,
        productListEmptyCheck,
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
