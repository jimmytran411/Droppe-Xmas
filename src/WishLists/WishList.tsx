import { getProduct, IProduct, IWishList, IWishListProduct } from 'api/wishList';
import React, { useEffect, useState } from 'react';
import './product.css';

interface IProductWithQuantity extends IProduct {
  quantity: number;
}

export const WishList = ({ id, userId, date, products }: IWishList) => {
  const [loading, setLoading] = useState<false | true>();
  const [wishListProductList, setWishListProductList] = useState<Array<IProductWithQuantity>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        wishListProductList && setWishListProductList([]);
        products.forEach(async ({ productId, quantity }: IWishListProduct) => {
          const { data } = await getProduct(productId);
          const productData: IProductWithQuantity = { ...data, quantity };
          setWishListProductList((prev: undefined | Array<IProductWithQuantity>) => {
            return prev ? [...prev, productData] : [productData];
          });
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return (
    <div className="wishlist">
      {loading && <p>Fetching product from the server. Please wait</p>}
      {wishListProductList &&
        wishListProductList.map((product: IProductWithQuantity, index: number) => {
          return (
            <div key={index} className="product-card">
              <img src={product.image} alt="Denim Jeans" />
              <h1>{product.title}</h1>
              <p className="price">€{product.price}</p>
              <p>{product.description}</p>
              <p>{product.quantity}</p>
              <p>
                <button>Approve</button>
                <button>Discard</button>
              </p>
            </div>
          );
        })}
    </div>
  );
};
