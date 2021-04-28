import * as React from 'react';
import * as _ from 'lodash';

import { ProductDetail } from 'api/wishList';

export type ProductDetailList = ProductDetail[];
export interface ProductContextProps {
  productDetailList: ProductDetailList;
  updateProductDetailList: (productDetail: ProductDetail) => void;
  getProductFromContext: (productId: number) => ProductDetail | undefined;
}

const initialProductContextValue: ProductContextProps = {
  productDetailList: [],
  updateProductDetailList: () => {},
  getProductFromContext: () => undefined,
};

const ProductContext = React.createContext<ProductContextProps>(initialProductContextValue);

function ProductProvider(props: any) {
  const [productDetailList, setProductDetailList] = React.useState<ProductDetailList>([]);

  const updateProductDetailList = (productDetail: ProductDetail) => {
    setProductDetailList((prev) => [...prev, productDetail]);
  };

  const getProductFromContext = (productId: number) => {
    return _.find(productDetailList, (product) => product.id === productId);
  };

  return (
    <ProductContext.Provider value={{ productDetailList, getProductFromContext, updateProductDetailList }} {...props} />
  );
}
const useProduct = () => React.useContext(ProductContext);

export { ProductProvider, useProduct, ProductContext };
