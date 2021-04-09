import { getAllWishLists, getProduct, IProduct, IWishList, IWishListProduct } from 'api/wishList';
import * as React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';

export interface ICart {
  allwishlist: IWishList[];
  currentWishList: IWishlistWithProductDetail | undefined;
  setCurrentWL: (wishlist: IWishList) => void;
  overview: IProduct[];
  currentCartPrice: number;
  totalPrice: number;
  approve: () => void;
  discard: () => void;
  pending: () => void;
}
const initialCartValue: ICart = {
  allwishlist: [],
  currentWishList: undefined,
  setCurrentWL: () => {},
  overview: [],
  currentCartPrice: 0,
  totalPrice: 0,
  approve: () => {},
  discard: () => {},
  pending: () => {},
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [allWishList, setAllWishList] = React.useState<any>([]);
  const [currentWishList, setCurrentWishList] = React.useState<IWishlistWithProductDetail>();
  const [productDetailList, setProductDetailList] = React.useState<IProduct[]>([]);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        const { data } = await getAllWishLists();
        setAllWishList(data);
        data.forEach((wishlist: IWishList) => {
          wishlist.products.forEach(async ({ productId }: IWishListProduct) => {
            const { data } = await getProduct(productId);
            const initialProduct: IProduct = { ...data, currentState: 'pending' };
            setProductDetailList((prev: IProduct[]) => [...prev, initialProduct]);
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllWishList();
  }, []);
  const setCurrentWL = (wishlist: IWishList) => {
    const wishListWithProductDetail = wishlist.products.map(({ productId }: IWishListProduct) => {
      return productDetailList.filter((product: IProduct) => {
        return product.id === productId;
      });
    });
    const currWL: IWishlistWithProductDetail = {
      id: wishlist.id,
      userid: wishlist.userId,
      products: wishListWithProductDetail,
    };
    setCurrentWishList(currWL);
  };

  return <CartContext.Provider value={{ allwishlist: allWishList, currentWishList, setCurrentWL }} {...props} />;
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
