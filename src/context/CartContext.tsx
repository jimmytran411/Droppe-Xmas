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
  allWishlistDuplicateCount: (product: IProduct) => number;
}

interface IDiscountCheck {
  discountCheckedPrice: number;
  duplicate: number;
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
  allWishlistDuplicateCount: () => 0,
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [allWishList, setAllWishList] = React.useState<IWishlistWithProductDetail[]>([]);
  const [currentWishList, setCurrentWishList] = React.useState<IWishlistWithProductDetail>();
  const [currentCartPrice, setCurrentCartPrice] = React.useState<number>(0);
  const [currentSaving, setCurrentSaving] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [totalPriceWithoutDiscount, setTotalPriceWithoutDiscount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
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
    { discountCheckedPrice, duplicate }: IDiscountCheck,
    originalPrice: number
  ) => {
    const possibleSaving = originalPrice - discountCheckedPrice;
    if (productNewState === 'approved') {
      setCurrentCartPrice((prev: number) => prev + discountCheckedPrice);
      setTotalPrice((prev: number) => {
        if (duplicate === 0) {
          return prev + originalPrice;
        } else if (duplicate === 1) {
          return prev - originalPrice + (2 * originalPrice * 9) / 10;
        } else {
          return (
            prev -
            (duplicate * originalPrice * (10 - duplicate + 1)) / 10 + //minus the previous discount
            ((duplicate + 1) * originalPrice * (10 - duplicate)) / 10 // add new discount
          );
        }
      });
      setCurrentSaving((prev: number) => prev + possibleSaving);
      setTotalPriceWithoutDiscount((prev: number) => prev + originalPrice);
    }
    if (productCurrentState === 'approved') {
      setCurrentCartPrice((prev: number) => prev - discountCheckedPrice);
      setTotalPrice((prev: number) => {
        if (duplicate === 0) {
          return prev - originalPrice;
        } else if (duplicate === 1) {
          return prev + originalPrice - (2 * originalPrice * 9) / 10;
        } else {
          return (
            prev +
            (duplicate * originalPrice * (10 - duplicate + 1)) / 10 - // add the previous discount
            ((duplicate + 1) * originalPrice * (10 - duplicate)) / 10 // minus the previous discount
          );
        }
      });
      setCurrentSaving((prev: number) => prev - possibleSaving);
      setTotalPriceWithoutDiscount((prev: number) => prev - originalPrice);
    }
  };

  const discountPrice = (currentProduct: IProduct, currentWLId: number) => {
    let duplicateCount: number = 0;
    allWishList.forEach((wishlist: IWishlistWithProductDetail) => {
      wishlist.products.forEach((product: IProduct) => {
        if (product.currentState === 'approved' && product.id === currentProduct.id && wishlist.id !== currentWLId) {
          duplicateCount += 1;
        }
      });
    });
    const discountedPrice =
      duplicateCount > 0 ? (currentProduct.price * (10 - duplicateCount)) / 10 : currentProduct.price;
    const discountCheck: IDiscountCheck = {
      discountCheckedPrice: discountedPrice,
      duplicate: duplicateCount,
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

  const allWishlistDuplicateCount = (productToCheck: IProduct) => {
    let count = 0;
    allWishList &&
      currentWishList &&
      allWishList.forEach(({ products, id }: IWishlistWithProductDetail) => {
        products.forEach((product: IProduct) => {
          product.id === productToCheck.id && currentWishList.id !== id && count++;
        });
      });
    return count === 0 ? 0 : count + 1;
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
        allWishlistDuplicateCount,
      }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
