import { Product } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import { Loading } from 'context/CartContext';
import { WishlistWithProductDetail } from 'WishList';

export interface ProductWithQuantity extends Product {
  quantity: number;
}

export const getProductWithQuantity = (
  listToCheck: WishlistWithProductDetail[],
  givenStatus: 'pending' | 'approved' | 'discarded'
) => {
  const productWithCheckedStateList: Product[] = [];
  listToCheck.forEach((wishlist: WishlistWithProductDetail) => {
    return wishlist.products.forEach(
      (product: Product | Loading) =>
        product !== 'loading' && product.approvalStatus === givenStatus && productWithCheckedStateList.push(product)
    );
  });
  const mapOfApprovedProducts = productWithCheckedStateList
    .reduce((mapObj, product: Product) => {
      const id: string = JSON.stringify([product.id]);
      if (!mapObj.has(id)) mapObj.set(id, { ...product, quantity: 0 });
      mapObj.get(id).quantity++;
      return mapObj;
    }, new Map())
    .values();
  const productWithQuantityList: ProductWithQuantity[] = [...mapOfApprovedProducts];
  return productWithQuantityList;
};

export const countTotalProductWithGivenStatus = (
  listToCheck: WishlistWithProductDetail[],
  givenStatus: ApprovalStatus
) => {
  let count = 0;
  listToCheck.forEach((wishlist) => {
    wishlist.products.forEach((product) => {
      if (product !== 'loading') {
        product.approvalStatus === givenStatus && count++;
      }
    });
  });
  return count;
};

export const productListEmptyCheck = (productList: (Product | Loading)[], givenStatus: ApprovalStatus) => {
  if (productList && productList.length) {
    const productListcheck = productList.filter(
      (product: Product | Loading) => product !== 'loading' && product.approvalStatus === givenStatus
    );
    return productListcheck.length ? false : true;
  }
};

export const countTotalProductQuantity = (
  productToCheck: Product | Loading,
  wishlistOfProduct: WishlistWithProductDetail,
  wishlists: WishlistWithProductDetail[]
) => {
  if (productToCheck !== 'loading') {
    let quantity = 1;
    wishlists &&
      wishlistOfProduct &&
      wishlists.forEach(({ products, id }: WishlistWithProductDetail) => {
        products.forEach((product: Product | Loading) => {
          if (product !== 'loading') {
            product.id === productToCheck.id && wishlistOfProduct.id !== id && quantity++;
          }
        });
      });
    return quantity === 1 ? 1 : quantity;
  } else {
    return 0;
  }
};
