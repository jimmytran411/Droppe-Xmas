import { getAllWishLists, getProduct, IProduct, IWishList, IWishListProduct } from 'api/wishList';
import * as React from 'react';
import { totalDiscountCal, totalPriceCal, wishlistPriceCal } from 'utils/priceCalculation';
import { totalProductWithGivenState } from 'utils/wishlistAndProduct';
import { IWishlistWithProductDetail } from 'WishLists';

export interface ICart {
  allwishlist: IWishlistWithProductDetail[];
  currentWishList: IWishlistWithProductDetail | undefined;
  handleOpenWishList: (wishlist: IWishlistWithProductDetail) => void;
  currentCartPrice: number;
  currentSaving: number;
  totalPrice: number;
  totalDiscount: number;
  handleProduct: (
    product: IProduct,
    newState: 'pending' | 'approved' | 'discarded',
    wishListOfProduct: IWishlistWithProductDetail
  ) => void;
  productListEmptyCheck: (product: IProduct[], givenState: 'pending' | 'approved' | 'discarded') => boolean;
  totalQuantity: (product: IProduct) => number;
  isLoading: boolean;
  totalApprovedProduct: number;
  handlePayment: () => void;
}

const initialCartValue: ICart = {
  allwishlist: [],
  currentWishList: undefined,
  handleOpenWishList: () => {},
  currentCartPrice: 0,
  currentSaving: 0,
  totalPrice: 0,
  totalDiscount: 0,
  handleProduct: () => {},
  productListEmptyCheck: () => false,
  totalQuantity: () => 0,
  isLoading: true,
  totalApprovedProduct: 0,
  handlePayment: () => {},
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [allWishList, setAllWishList] = React.useState<IWishlistWithProductDetail[]>([]);
  const [currentWishList, setCurrentWishList] = React.useState<IWishlistWithProductDetail>();
  const [currentCartPrice, setCurrentCartPrice] = React.useState<number>(0);
  const [currentSaving, setCurrentSaving] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [totalDiscount, setTotalDiscount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalApprovedProduct, setTotalApprovedProduct] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        setIsLoading(true);
        const { data } = await getAllWishLists();
        const allWLWithDetailedProduct = data.map((wishlist: IWishList) => {
          // this method to prevent Promise return type
          const detailedProducts: IProduct[] = [];
          wishlist.products.forEach(async ({ productId }: IWishListProduct) => {
            const product = await getProduct(productId);
            detailedProducts.push(product);
          });
          return { id: wishlist.id, userid: wishlist.userId, products: detailedProducts };
        });
        setAllWishList(allWLWithDetailedProduct);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllWishList();
  }, []);

  const handleOpenWishList = (wishlist: IWishlistWithProductDetail) => {
    setCurrentWishList(wishlist);
    const { priceAfterDiscount, totalDiscount } = wishlistPriceCal(wishlist, allWishList);
    setCurrentSaving(totalDiscount);
    setCurrentCartPrice(priceAfterDiscount);
  };

  // product's state change => change in:
  //    allwishlist, currentwishlist, currentCartPrice, currentSaving, totalPrice, totalSaving
  const handleProduct = (
    handledProduct: IProduct,
    productNewState: 'pending' | 'approved' | 'discarded',
    wishListOfProduct: IWishlistWithProductDetail
  ) => {
    // Update AllWishlist , CurrentWishList
    const updateProductList: IProduct[] = wishListOfProduct.products.map((prevProduct: IProduct) => {
      const updatedProduct: IProduct = { ...prevProduct, currentState: productNewState };
      return prevProduct.id === handledProduct.id ? updatedProduct : prevProduct;
    });
    const updatedWishlist: IWishlistWithProductDetail = { ...wishListOfProduct, products: updateProductList };
    const updatedAllWishlist: IWishlistWithProductDetail[] = allWishList.map((wishlist: IWishlistWithProductDetail) => {
      return wishlist.id === updatedWishlist.id ? updatedWishlist : wishlist;
    });

    const { totalDiscount, priceAfterDiscount } = wishlistPriceCal(updatedWishlist, updatedAllWishlist);
    setCurrentCartPrice(priceAfterDiscount);
    setCurrentSaving(totalDiscount);

    const updatedTotalPrice = totalPriceCal(updatedAllWishlist);
    setTotalPrice(updatedTotalPrice);

    const updatedTotalDiscount = totalDiscountCal(updatedAllWishlist);
    setTotalDiscount(updatedTotalDiscount);

    const updatedTotalApprovedProduct = totalProductWithGivenState(updatedAllWishlist, 'approved');
    setTotalApprovedProduct(updatedTotalApprovedProduct);

    setAllWishList(updatedAllWishlist);
    setCurrentWishList(updatedWishlist);
  };

  const productListEmptyCheck = (productList: IProduct[], givenState: 'pending' | 'approved' | 'discarded') => {
    const productListcheck = productList.filter((product: IProduct) => product.currentState === givenState);
    return productListcheck.length ? false : true;
  };

  const totalQuantity = (productToCheck: IProduct) => {
    let quantity = 1;
    allWishList &&
      currentWishList &&
      allWishList.forEach(({ products, id }: IWishlistWithProductDetail) => {
        products.forEach((product: IProduct) => {
          product.id === productToCheck.id && currentWishList.id !== id && quantity++;
        });
      });
    return quantity === 1 ? 1 : quantity;
  };

  const handlePayment = () => {
    // Reset allprice, cart, and change state of all product to pending
    setAllWishList((prev: IWishlistWithProductDetail[]) => {
      const resetAllWishList: IWishlistWithProductDetail[] = prev.map((wishlist: IWishlistWithProductDetail) => {
        const productList = wishlist.products.map((product: IProduct) => {
          const resetStateProduct: IProduct = { ...product, currentState: 'pending' };
          return resetStateProduct;
        });
        return { ...wishlist, products: productList };
      });
      return resetAllWishList;
    });
    setTotalPrice(0);
    setTotalApprovedProduct(0);
    setTotalDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        allwishlist: allWishList,
        currentWishList,
        handleOpenWishList,
        handleProduct,
        currentCartPrice,
        currentSaving,
        totalPrice,
        totalDiscount,
        productListEmptyCheck,
        totalQuantity,
        isLoading,
        totalApprovedProduct,
        handlePayment,
      }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
