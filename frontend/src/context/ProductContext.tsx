import * as React from 'react';
import * as _ from 'lodash';

import { getProductDetail, ProductDetail } from 'api/wishList';
import { Loading } from 'common/commonType';

export type ProductDetailList = (ProductDetail | Loading)[];
export interface ProductContextProps {
  productDetailList: ProductDetailList;
  getProduct: (id: number) => ProductDetail | Loading;
}

const initialProductContextValue: ProductContextProps = {
  productDetailList: [],
  getProduct: () => 'loading',
};

const ProductContext = React.createContext<ProductContextProps>(initialProductContextValue);

function ProductProvider(props: any) {
  const [productDetailList, setProductDetailList] = React.useState<ProductDetailList>([]);

  const getProduct = async (id: number) => {
    const productDetail = _.find(productDetailList, (product) => product !== 'loading' && product.id === id);
    if (!productDetail) {
      try {
        const { data } = await getProductDetail(id);
        setProductDetailList((prev) => [...prev, data ? data : 'loading']);
        getProduct(id);
      } catch (error) {
        console.log(error);
      }
    }
    return productDetail;
  };

  return <ProductContext.Provider value={{ productDetailList, getProduct: getProduct }} {...props} />;
}
const useProduct = () => React.useContext(ProductContext);

export { ProductProvider, useProduct, ProductContext };
