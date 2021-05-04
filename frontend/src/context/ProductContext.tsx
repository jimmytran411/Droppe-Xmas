import * as React from 'react';
import * as _ from 'lodash';

import { getProductDetail, ProductDetail } from 'api/wishList';

export type ProductDetailList = ProductDetail[];
export interface ProductContextProps {
  productDetailList: ProductDetailList;
  getProductFromContext: (productId: number) => ProductDetail | undefined;
}

const initialProductContextValue: ProductContextProps = {
  productDetailList: [],
  getProductFromContext: () => undefined,
};

const ProductContext = React.createContext<ProductContextProps>(initialProductContextValue);

const ProductProvider: React.FC = (props: any) => {
  const [productDetailList, setProductDetailList] = React.useState<ProductDetailList>([]);

  const getProductFromContext = (productId: number): any => {
    const detail = _.find(productDetailList, (product) => product.id === productId);
    if (!detail) {
      fetchProductDetailAndUpdate(productId);
    }
    return detail;
  };

  const fetchProductDetailAndUpdate = async (id: number) => {
    const { data } = await getProductDetail(id);
    setProductDetailList((prev) => [...prev, data]);
  };

  return <ProductContext.Provider value={{ productDetailList, getProductFromContext }} {...props} />;
};
const useProduct = (): ProductContextProps => React.useContext(ProductContext);

export { ProductProvider, useProduct, ProductContext };
