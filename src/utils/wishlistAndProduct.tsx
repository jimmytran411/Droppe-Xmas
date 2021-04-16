import { IProduct } from 'api/wishList';
import { ApprovalStatus } from 'common/commonType';
import { WishlistWithProductDetail } from 'WishLists';

export interface IProductWithQuantity extends IProduct {
  quantity: number;
}

export const productWithQuantity = (
  listToCheck: WishlistWithProductDetail[],
  stateToCheck: 'pending' | 'approved' | 'discarded'
) => {
  const productWithCheckedStateList: IProduct[] = [];
  listToCheck.forEach((wishlist: WishlistWithProductDetail) => {
    return wishlist.products.forEach(
      (product: IProduct) => product.approvalStatus === stateToCheck && productWithCheckedStateList.push(product)
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

export const CountTotalProductWithGivenStatus = (
  listToCheck: WishlistWithProductDetail[],
  givenStatus: ApprovalStatus
) => {
  let count = 0;
  listToCheck.forEach((wishlist) => {
    wishlist.products.forEach((product) => {
      product.approvalStatus === givenStatus && count++;
    });
  });
  return count;
};

export const productListEmptyCheck = (productList: IProduct[], givenStatus: ApprovalStatus) => {
  const productListcheck = productList.filter((product: IProduct) => product.approvalStatus === givenStatus);
  return productListcheck.length ? false : true;
};
