import { IProduct } from 'api/wishList';
import { IWishlistWithProductDetail } from 'WishLists';
import { IProductWithQuantity, productWithQuantity } from './wishlistAndProduct';

export interface IDiscountCheck {
  discountCheckedPrice: number;
  quantity: number;
}

export interface ICurrentWishlistPrice {
  priceAfterDiscount: number;
  totalDiscount: number;
  totalPrice: number;
}

export const discountCheck = (
  allwishlist: IWishlistWithProductDetail[],
  currentProduct: IProduct,
  currentWLId: number
) => {
  let quantity: number = 1;
  allwishlist.forEach((wishlist: IWishlistWithProductDetail) => {
    wishlist.products.forEach((product: IProduct) => {
      if (product.currentState === 'approved' && product.id === currentProduct.id && wishlist.id !== currentWLId) {
        quantity += 1;
      }
    });
  });
  const discountedPrice = quantity > 1 ? (currentProduct.price * (10 - quantity)) / 10 : currentProduct.price;
  const discountCheck: IDiscountCheck = {
    discountCheckedPrice: discountedPrice,
    quantity,
  };
  return discountCheck;
};

export const wishlistPriceCal = (wishlist: IWishlistWithProductDetail, allWishList: IWishlistWithProductDetail[]) => {
  let priceAfterDiscount = 0;
  let totalPrice = 0;
  wishlist.products.forEach((product: IProduct) => {
    let discount = 0;
    if (product.currentState === 'approved') {
      totalPrice += product.price;
      discount = discountCheck(allWishList, product, wishlist.id).discountCheckedPrice;
    }
    priceAfterDiscount += discount;
  });
  let totalDiscount = totalPrice - priceAfterDiscount;
  const currentCartPrice: ICurrentWishlistPrice = { priceAfterDiscount, totalDiscount, totalPrice };
  return currentCartPrice;
};

export const totalPriceCal = (allwishlist: IWishlistWithProductDetail[]) => {
  const approvedProductList = productWithQuantity(allwishlist, 'approved');
  let totalPrice = 0;
  approvedProductList.forEach(({ price, quantity }: IProductWithQuantity) => {
    quantity > 1 ? (totalPrice += (price * quantity * (10 - quantity)) / 10) : (totalPrice += price);
  });
  return totalPrice;
};

export const totalDiscountCal = (allwishlist: IWishlistWithProductDetail[]) => {
  const approvedProductList = productWithQuantity(allwishlist, 'approved');
  let totalDiscount = 0;
  approvedProductList.forEach(({ price, quantity }: IProductWithQuantity) => {
    quantity > 1 && (totalDiscount += (price * quantity * quantity) / 10);
  });
  return totalDiscount;
};