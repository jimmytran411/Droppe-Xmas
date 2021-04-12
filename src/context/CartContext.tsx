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
  overview: IProduct[];
  handleProduct: (product: IProduct, newState: 'pending' | 'approved' | 'discarded') => void;
  updateWishList: (wishlist: IWishlistWithProductDetail) => void;
}

const initialCartValue: ICart = {
  allwishlist: [],
  currentWishList: undefined,
  handleOpenWishList: () => {},
  currentCartPrice: 0,
  currentSaving: 0,
  totalPrice: 0,
  overview: [],
  handleProduct: () => {},
  updateWishList: () => {},
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [allWishList, setAllWishList] = React.useState<IWishlistWithProductDetail[]>([]);
  const [currentWishList, setCurrentWishList] = React.useState<IWishlistWithProductDetail>();
  const [currentCartPrice, setCurrentCartPrice] = React.useState<number>(0);
  const [currentSaving, setCurrentSaving] = React.useState<number>(0);

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
        discount = discountPrice(product, wishlist.id);
      }
      currentPrice += discount;
    });
    setCurrentSaving(totalCartPrice - currentPrice);
    setCurrentCartPrice(currentPrice);
  };

  const handleCurrentPrice = (
    productCurrentState: 'pending' | 'approved' | 'discarded',
    productNewState: 'pending' | 'approved' | 'discarded',
    productPrice: number
  ) => {
    if (productNewState === 'approved') {
      setCurrentCartPrice((prev: number) => prev + productPrice);
    }
    if (productCurrentState === 'approved' && productNewState !== 'approved') {
      setCurrentCartPrice((prev: number) => prev - productPrice);
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
    return (currentProduct.price * (10 - duplicateCount)) / 10;
  };

  const handleProduct = (handledProduct: IProduct, productNewState: 'pending' | 'approved' | 'discarded') => {
    if (currentWishList) {
      // Display Total Price wih possible discount
      const discountedProduct = discountPrice(handledProduct, currentWishList.id);
      handleCurrentPrice(handledProduct.currentState, productNewState, discountedProduct);
      // Calculate possible saving
      const possibleSaving = handledProduct.price - discountedProduct;
      if (productNewState === 'approved') {
        setCurrentSaving((prev: number) => (prev += possibleSaving));
      } else {
        setCurrentSaving((prev: number) => (prev -= possibleSaving));
      }

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
      }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
