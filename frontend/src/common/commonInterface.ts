import { ApprovalStatus } from './commonType';

export interface ProductWithStatus {
  productId: number;
  approvalStatus: ApprovalStatus;
}
export interface WishlistWithProductStatus {
  wishlistId: number;
  productList: ProductWithStatus[];
}
