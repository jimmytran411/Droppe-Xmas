import { ProductWithQuantityList, ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ApprovalStatus } from 'common/commonType';

export const getUniqueProductWithGivenStatusAndQuantity = (
  listToCheck: WishlistWithProductStatus[],
  givenStatus: ApprovalStatus
): ProductWithQuantityList[] => {
  const productWithCheckedStateList: ProductWithStatus[] = [];
  listToCheck.forEach((wishlist) => {
    wishlist.productList.forEach((product) => {
      product.approvalStatus === givenStatus && productWithCheckedStateList.push(product);
    });
  });

  const mapOfApprovedProducts = productWithCheckedStateList
    .reduce((mapObj, product: ProductWithStatus) => {
      const id: string = JSON.stringify([product.productId]);

      !mapObj.has(id) && mapObj.set(id, { ...product, quantity: 0 });
      mapObj.get(id).quantity++;

      return mapObj;
    }, new Map())
    .values();

  const productWithQuantityList: ProductWithQuantityList[] = [...mapOfApprovedProducts];
  return productWithQuantityList;
};
