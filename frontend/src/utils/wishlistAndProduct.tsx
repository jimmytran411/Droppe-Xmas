import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ApprovalStatus } from 'common/commonType';

export interface ProductWithQuantity extends ProductWithStatus {
  quantity: number;
}

export const getProductWithQuantity = (listToCheck: WishlistWithProductStatus[], givenStatus: ApprovalStatus) => {
  const { productWithCheckedStateList } = countTotalProductWithGivenStatus(listToCheck, givenStatus);
  const mapOfApprovedProducts = productWithCheckedStateList
    .reduce((mapObj, product: ProductWithStatus) => {
      const id: string = JSON.stringify([product.productId]);
      if (!mapObj.has(id)) mapObj.set(id, { ...product, quantity: 0 });
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

export const productListEmptyCheck = (productList: ProductWithStatus[], givenStatus: ApprovalStatus) => {
  if (productList && productList.length) {
    const productListcheck = productList.filter((product: ProductWithStatus) => product.approvalStatus === givenStatus);
    return productListcheck.length ? false : true;
  }
};

export const countTotalProductQuantity = (
  productToCheck: ProductWithStatus,
  wishlistOfProduct: WishlistWithProductStatus,
  wishlists: WishlistWithProductStatus[]
): number => {
  let quantity = 1;
  wishlists &&
    wishlistOfProduct &&
    wishlists.forEach(({ productList, wishlistId }: WishlistWithProductStatus) => {
      productList.forEach((product: ProductWithStatus) => {
        if (product.productId === productToCheck.productId && wishlistOfProduct.wishlistId !== wishlistId) {
          quantity++;
        }
      });
    });
  return quantity === 1 ? 1 : quantity;
};
