import { getAllWishLists, getProduct, IProduct, IWishList, IWishListProduct, patchWishlist } from 'api/wishList';
import * as React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';

export interface ICart {
  allwishlist: IWishlistWithProductDetail[];
  currentWishList: IWishlistWithProductDetail | undefined;
  handleOpenWishList: (wishlist: IWishlistWithProductDetail) => void;
  currentCartPrice: number;
  currentSaving: number;
  totalPrice: number;
  totalPriceWithoutDiscount: number;
  handleProduct: (product: IProduct, newState: 'pending' | 'approved' | 'discarded') => void;
  updateWishList: (wishlist: IWishlistWithProductDetail) => void;
  productListEmptyCheck: (product: IProduct[], givenState: 'pending' | 'approved' | 'discarded') => boolean;
  totalQuantity: (product: IProduct) => number;
  isLoading: boolean;
  totalApprovedProduct: number;
  handlePayment: () => void;
}

interface IDiscountCheck {
  discountCheckedPrice: number;
  quantity: number;
}

const initialCartValue: ICart = {
  allwishlist: [],
  currentWishList: undefined,
  handleOpenWishList: () => {},
  currentCartPrice: 0,
  currentSaving: 0,
  totalPrice: 0,
  totalPriceWithoutDiscount: 0,
  handleProduct: () => {},
  updateWishList: () => {},
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
  const [totalPriceWithoutDiscount, setTotalPriceWithoutDiscount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalApprovedProduct, setTotalApprovedProduct] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        setIsLoading(true);
        const { data } = await getAllWishLists();
        const allWLWithDetailedProduct = data.map((wishlist: IWishList) => {
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
    let currentPrice = 0;
    let totalCartPrice = 0;
    wishlist.products.forEach((product: IProduct) => {
      let discount = 0;
      if (product.currentState === 'approved') {
        totalCartPrice += product.price;
        discount = discountPrice(product, wishlist.id).discountCheckedPrice;
      }
      currentPrice += discount;
    });
    setCurrentSaving(totalCartPrice - currentPrice);
    setCurrentCartPrice(currentPrice);
  };

  const handleCurrentPrice = (
    productCurrentState: 'pending' | 'approved' | 'discarded',
    productNewState: 'pending' | 'approved' | 'discarded',
    { discountCheckedPrice, quantity }: IDiscountCheck,
    originalPrice: number
  ) => {
    const possibleSaving = originalPrice - discountCheckedPrice;
    if (productNewState === 'approved') {
      setCurrentCartPrice((prev: number) => prev + discountCheckedPrice);
      setTotalPrice((prev: number) => {
        if (quantity === 1) {
          return prev + originalPrice;
        } else if (quantity === 2) {
          return prev - originalPrice + (2 * originalPrice * 8) / 10;
        } else {
          return (
            prev -
            ((quantity - 1) * originalPrice * (10 - quantity + 1)) / 10 + //minus the previous discount
            quantity * discountCheckedPrice // add new discount
          );
        }
      });
      setCurrentSaving((prev: number) => prev + possibleSaving);
      setTotalPriceWithoutDiscount((prev: number) => prev + originalPrice);
      setTotalApprovedProduct((prev) => prev + 1);
    }
    if (productCurrentState === 'approved') {
      setCurrentCartPrice((prev: number) => prev - discountCheckedPrice);
      setTotalPrice((prev: number) => {
        if (quantity === 1) {
          return prev - originalPrice;
        } else if (quantity === 2) {
          return prev + originalPrice - (2 * originalPrice * 8) / 10;
        } else {
          return (
            prev +
            ((quantity - 1) * originalPrice * (10 - quantity + 1)) / 10 - // add the new discount
            quantity * discountCheckedPrice // minus the previous discount
          );
        }
      });
      setCurrentSaving((prev: number) => prev - possibleSaving);
      setTotalPriceWithoutDiscount((prev: number) => prev - originalPrice);
      setTotalApprovedProduct((prev) => prev - 1);
    }
  };

  const discountPrice = (currentProduct: IProduct, currentWLId: number) => {
    let quantity: number = 1;
    allWishList.forEach((wishlist: IWishlistWithProductDetail) => {
      wishlist.products.forEach((product: IProduct) => {
        if (product.currentState === 'approved' && product.id === currentProduct.id && wishlist.id !== currentWLId) {
          quantity += 1;
        }
      });
    });
    const discountedPrice = quantity > 1 ? (currentProduct.price * (10 - quantity)) / 10 : currentProduct.price;
    const discountCheck: IDiscountCheck = {
      discountCheckedPrice: discountedPrice,
      quantity,
    };
    return discountCheck;
  };

  const handleProduct = (handledProduct: IProduct, productNewState: 'pending' | 'approved' | 'discarded') => {
    if (currentWishList) {
      // Display Total Price wih possible discount
      const discountCheckedProduct = discountPrice(handledProduct, currentWishList.id);
      handleCurrentPrice(handledProduct.currentState, productNewState, discountCheckedProduct, handledProduct.price);
      // Update AllWishlist and CurrentWishList
      const updateProductList: IProduct[] = currentWishList.products.map((prevProduct: IProduct) => {
        const updatedProduct: IProduct = { ...prevProduct, currentState: productNewState };
        return prevProduct.id === handledProduct.id ? updatedProduct : prevProduct;
      });
      const updateCurrentWL: IWishlistWithProductDetail = { ...currentWishList, products: updateProductList };
      setAllWishList((prev: IWishlistWithProductDetail[]) => {
        return prev.map((wishlist: IWishlistWithProductDetail) => {
          return wishlist.id === updateCurrentWL.id ? updateCurrentWL : wishlist;
        });
      });
      setCurrentWishList(updateCurrentWL);
    }
  };

  const updateWishList = async (wishlist: IWishlistWithProductDetail) => {
    try {
      setCurrentWishList(undefined);
      const { data } = await patchWishlist(wishlist);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
    return quantity === 1 ? 1 : quantity + 1;
  };

  const handlePayment = () => {
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
    setTotalPriceWithoutDiscount(0);
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
        updateWishList,
        totalPrice,
        totalPriceWithoutDiscount,
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
