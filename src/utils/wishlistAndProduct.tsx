import { IProduct } from 'api/wishList';
import { IWishlistWithProductDetail } from 'WishLists';

export interface IProductWithQuantity extends IProduct {
  quantity: number;
}

export const productWithQuantity = (
  listToCheck: IWishlistWithProductDetail[],
  stateToCheck: 'pending' | 'approved' | 'discarded'
) => {
  const productWithCheckedStateList: IProduct[] = [];
  listToCheck.forEach((wishlist: IWishlistWithProductDetail) => {
    return wishlist.products.forEach(
      (product: IProduct) => product.currentState === stateToCheck && productWithCheckedStateList.push(product)
    );
  });
  const mapOfApprovedProducts = productWithCheckedStateList
    .reduce((mapObj, product: IProduct) => {
      const id: string = JSON.stringify([product.id]);
      if (!mapObj.has(id)) mapObj.set(id, { ...product, quantity: 0 });
      mapObj.get(id).quantity++;
      return mapObj;
    }, new Map())
    .values();
  const productWithQuantityList: IProductWithQuantity[] = [...mapOfApprovedProducts];
  return productWithQuantityList;
};

export const totalProductWithGivenState = (
  listToCheck: IWishlistWithProductDetail[],
  givenState: 'approved' | 'pending' | 'discarded'
) => {
  let count = 0;
  listToCheck.forEach((wishlist) => {
    wishlist.products.forEach((product) => {
      product.currentState === givenState && count++;
    });
  });
  return count;
};
