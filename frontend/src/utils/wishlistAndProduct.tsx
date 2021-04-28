import { ProductWithQuantity, ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ApprovalStatus } from 'common/commonType';

export const getProductWithQuantity = (listToCheck: WishlistWithProductStatus[], givenStatus: ApprovalStatus) => {
  const { productWithCheckedStateList } = countTotalProductWithGivenStatus(listToCheck, givenStatus);

  const mapOfApprovedProducts = productWithCheckedStateList
    .reduce((mapObj, product: ProductWithStatus) => {
      const id: string = JSON.stringify([product.productId]);

      !mapObj.has(id) && mapObj.set(id, { ...product, quantity: 0 });
      mapObj.get(id).quantity++;

      return mapObj;
    }, new Map())
    .values();

  const productWithQuantityList: ProductWithQuantity[] = [...mapOfApprovedProducts];
  return productWithQuantityList;
};

export const countTotalProductWithGivenStatus = (
  listToCheck: WishlistWithProductStatus[],
  givenStatus: ApprovalStatus
) => {
  let count = 0;

  const productWithCheckedStateList: ProductWithStatus[] = [];
  listToCheck.forEach((wishlist) => {
    wishlist.productList.forEach((product) => {
      if (product.approvalStatus === givenStatus) {
        count++;
        productWithCheckedStateList.push(product);
      }
    });
  });
  return { count, productWithCheckedStateList };
};

export const countTotalProductQuantity = (productId: number, wishlists: WishlistWithProductStatus[]): number => {
  let quantity = 0;
  wishlists &&
    wishlists.forEach(({ productList }: WishlistWithProductStatus) => {
      productList.forEach((product: ProductWithStatus) => {
        product.productId === productId && quantity++;
      });
    });
  return quantity;
};
