import { getAllWishLists, getProduct, IProduct, IWishList, IWishListProduct } from 'api/wishList';
import * as React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';

export interface ICart {
  allwishlist: IWishList[];
  currentWishList: IWishlistWithProductDetail | undefined;
  handleOpenWishList: (wishlist: IWishList) => void;
  overview: IProduct[];
  currentCartPrice: number;
  totalPrice: number;
  approve: (product: IProduct) => void;
  discard: (product: IProduct) => void;
  pending: (product: IProduct) => void;
}
const initialCartValue: ICart = {
  allwishlist: [],
  currentWishList: undefined,
  handleOpenWishList: () => {},
  overview: [],
  currentCartPrice: 0,
  totalPrice: 0,
  approve: () => {},
  discard: () => {},
  pending: () => {},
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [allWishList, setAllWishList] = React.useState<IWishlistWithProductDetail[]>([]);
  const [currentWishList, setCurrentWishList] = React.useState<IWishlistWithProductDetail>();
  const [productDetailList, setProductDetailList] = React.useState<IProduct[]>([]);

  React.useEffect(() => {
    const fetchAllWishList = async () => {
      try {
        const { data } = await getAllWishLists();
        const allWLWithDetailedProduct = data.map((wishlist: IWishList) => {
          const detailedProducts: IProduct[] = [];
          wishlist.products.forEach(async ({ productId }: IWishListProduct) => {
            const { data } = await getProduct(productId);
            const productWithPendingState: IProduct = { ...data, currentState: 'pending' };
            detailedProducts.push(productWithPendingState);
          });
          const wl: IWishlistWithProductDetail = {
            id: wishlist.id,
            userid: wishlist.userId,
            products: detailedProducts,
          };
          return wl;
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
  };

  const approve = (product: IProduct) => {
    // const approveProduct =
    //   currentWishList &&
    //   currentWishList.products.map((prevProduct: IProduct[]) => {
    //     return prevProduct[0].id === product.id ? { ...prevProduct[0], currentState: 'approved' } : { ...prevProduct };
    //   });
    // console.log(approveProduct);
    // setCurrentWishList(approveProduct);
  };

  return (
    <CartContext.Provider
      value={{ allwishlist: allWishList, currentWishList, handleOpenWishList, approve }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
