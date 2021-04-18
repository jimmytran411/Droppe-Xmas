import { Product } from 'api/wishList';
import Modal from 'Modal';
import React, { useEffect, useState } from 'react';
import { WishlistWithProductDetail } from 'WishList';
import { Loading, useCart } from 'context/CartContext';
import { Loader } from 'utils/Loader';
import './ProductCard.css';
import { countTotalProductQuantity } from 'utils/wishlistAndProduct';

export interface ProductCardProps {
  product: Product | Loading;
  wishlist: WishlistWithProductDetail;
}

export const ProductCard = ({ product, wishlist }: ProductCardProps) => {
  const [isModal, setIsModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { handleProduct, wishlists } = useCart();
  const toggleModal = () => setIsModal(!isModal);
  useEffect(() => {
    const quantity = countTotalProductQuantity(product, wishlist, wishlists);
    const discountPercent = quantity > 1 && quantity * 10;
    discountPercent && setDiscount(discountPercent);
  }, [wishlists]);
  return (
    <>
      {!isModal && (
        <>
          {product === 'loading' && <Loader />}
          {product !== 'loading' && (
            <div className="product-card">
              {discount > 0 && <div className={`discount-label discount--${discount}`}></div>}
              <div className="product-card-img">
                <div style={{ backgroundImage: `url(${product.image})` }} onClick={toggleModal}></div>
              </div>

              <div className="product-card-content">
                <span className="product-card-title">{product.title}</span>
                <p className="price">€{product.price}</p>
                <div className="product-card-btn">
                  <a
                    className={product.approvalStatus === 'pending' ? 'primary' : 'secondary'}
                    aria-label={
                      product.approvalStatus === 'pending' ? `approve-btn-${product.id}` : `return-btn-${product.id}`
                    }
                    onClick={() => {
                      product.approvalStatus === 'pending'
                        ? handleProduct(product, 'approved', wishlist)
                        : handleProduct(product, 'pending', wishlist);
                    }}
                  >
                    {product.approvalStatus === 'pending' ? 'Add to cart' : 'Save to wishlist'}
                  </a>
                  <a
                    className={product.approvalStatus === 'discarded' ? 'primary' : 'secondary'}
                    aria-label={
                      product.approvalStatus === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                    }
                    onClick={() => {
                      product.approvalStatus === 'discarded'
                        ? handleProduct(product, 'approved', wishlist)
                        : handleProduct(product, 'discarded', wishlist);
                    }}
                  >
                    {product.approvalStatus === 'discarded' ? 'Add to cart' : 'Remove'}
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {isModal && (
        <Modal>
          {product !== 'loading' && (
            <div className="product-detail-modal">
              <img src={product.image} alt={product.title} />
              <h5>{product.title}</h5>
              <p className="price">€{product.price}</p>
              <p>{product.description}</p>
              <button onClick={toggleModal}>Back to Wishlist</button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
