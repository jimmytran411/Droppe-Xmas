import { Product } from 'api/wishList';
import { Loading } from 'common/commonType';
import { WishlistWithProductDetail } from 'WishList';
import { ProductWithQuantity, getProductWithQuantity } from './wishlistAndProduct';

export interface DiscountCheck {
  discountCheckedPrice: number;
  quantity: number;
}

export interface CurrentWishlistPrice {
  priceAfterDiscount: number;
  totalDiscount: number;
  totalPrice: number;
}

export const discountCheck = (wishlists: WishlistWithProductDetail[], currentProduct: Product, currentWLId: number) => {
  let quantity: number = 1;
  wishlists.forEach((wishlist: WishlistWithProductDetail) => {
    wishlist.products.forEach((product: Product | Loading) => {
      if (
        product !== 'loading' &&
        product.approvalStatus === 'approved' &&
        product.id === currentProduct.id &&
        wishlist.id !== currentWLId
      ) {
        quantity += 1;
      }
    });
  });
  const discountedPrice = quantity > 1 ? (currentProduct.price * (10 - quantity)) / 10 : currentProduct.price;
  const discountCheck: DiscountCheck = {
    discountCheckedPrice: discountedPrice,
    quantity,
  };
  return discountCheck;
};

export const calculateWishlistPrice = (wishlist: WishlistWithProductDetail, wishlists: WishlistWithProductDetail[]) => {
  let priceAfterDiscount = 0;
  let totalPrice = 0;
  if (wishlist.products && wishlist.products.length) {
    wishlist.products.forEach((product: Product | Loading) => {
      let discount = 0;
      if (product !== 'loading' && product.approvalStatus === 'approved') {
        totalPrice += product.price;
        discount = discountCheck(wishlists, product, wishlist.id).discountCheckedPrice;
      }
      priceAfterDiscount += discount;
    });
  }
  let totalDiscount = totalPrice - priceAfterDiscount;
  const currentWishlistPrice: CurrentWishlistPrice = { priceAfterDiscount, totalDiscount, totalPrice };
  return currentWishlistPrice;
};

export const calculateTotalPrice = (wishlists: WishlistWithProductDetail[]) => {
  const approvedProductList = getProductWithQuantity(wishlists, 'approved');
  let totalPrice = 0;
  approvedProductList.forEach(({ price, quantity }: ProductWithQuantity) => {
    quantity > 1 ? (totalPrice += (price * quantity * (10 - quantity)) / 10) : (totalPrice += price);
  });
  return totalPrice;
};

export const calculateTotalDiscount = (wishlists: WishlistWithProductDetail[]) => {
  const approvedProductList = getProductWithQuantity(wishlists, 'approved');
  let totalDiscount = 0;
  approvedProductList.forEach(({ price, quantity }: ProductWithQuantity) => {
    quantity > 1 && (totalDiscount += (price * quantity * quantity) / 10);
  });
  return totalDiscount;
};
