import { getAllWishLists, getProduct, IProduct, IWishList, IWishListProduct } from 'api/wishList';
import * as React from 'react';
import { IWishlistWithProductDetail } from 'WishLists';

export interface ICart {
  allwishlist: IWishlistWithProductDetail[];
  currentWishList: IWishlistWithProductDetail | undefined;
  handleOpenWishList: (wishlist: IWishlistWithProductDetail) => void;
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
  const [currentCartPrice, setCurrtentCartPrice] = React.useState<number>(0);

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
    setCurrtentCartPrice(0);
  };

  const handleCurrentPrice = (
    productCurrentState: 'pending' | 'approved' | 'discarded',
    productNewState: 'pending' | 'approved' | 'discarded',
    productPrice: number
  ) => {
    if (productNewState === 'approved') {
      setCurrtentCartPrice((prev: number) => prev + productPrice);
    }
    if (productCurrentState === 'approved' && productNewState !== 'approved') {
      setCurrtentCartPrice((prev: number) => prev - productPrice);
    }
  };

  const handleProduct = (handledProduct: IProduct, productNewState: 'pending' | 'approved' | 'discarded') => {
    handleCurrentPrice(handledProduct.currentState, productNewState, handledProduct.price);
    if (currentWishList) {
      const updateProductList = currentWishList.products.map((prevProduct: IProduct) => {
        const updatedProduct: IProduct = { ...prevProduct, currentState: productNewState };
        return prevProduct.id === handledProduct.id ? updatedProduct : prevProduct;
      });
      const updateCurrentWL: IWishlistWithProductDetail = { ...currentWishList, products: updateProductList };
      setCurrentWishList(updateCurrentWL);
    }
  };

  return (
    <CartContext.Provider
      value={{ allwishlist: allWishList, currentWishList, handleOpenWishList, handleProduct, currentCartPrice }}
      {...props}
    />
  );
}
const useCart = () => React.useContext(CartContext);

export { CartProvider, useCart, CartContext };
