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
  handleProduct: (product: IProduct, newState: 'pending' | 'approved' | 'discarded') => void;
}

const initialCartValue: ICart = {
  allwishlist: [],
  currentWishList: undefined,
  handleOpenWishList: () => {},
  overview: [],
  currentCartPrice: 0,
  totalPrice: 0,
  handleProduct: () => {},
};
const CartContext = React.createContext<ICart>(initialCartValue);
function CartProvider(props: any) {
  const [allWishList, setAllWishList] = React.useState<IWishlistWithProductDetail[]>([]);
  const [currentWishList, setCurrentWishList] = React.useState<IWishlistWithProductDetail>();

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

  const handleProduct = (product: IProduct, productNewState: 'pending' | 'approved' | 'discarded') => {
    if (currentWishList) {
      const approveProductList = currentWishList.products.map((prevProduct: IProduct) => {
        const approvedProduct: IProduct = { ...prevProduct, currentState: productNewState };
        return prevProduct.id === product.id ? approvedProduct : prevProduct;
      });
      const updateCurrentWL: IWishlistWithProductDetail = { ...currentWishList, products: approveProductList };
      setCurrentWishList(updateCurrentWL);
    }
  };

  return (
    <CartContext.Provider
      value={{ allwishlist: allWishList, currentWishList, handleOpenWishList, handleProduct }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
