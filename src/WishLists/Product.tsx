import { IProduct } from 'api/wishList';
import Modal from 'Modal';
import React, { useState } from 'react';
import './Product.css';

export const Product = (product: IProduct) => {
  const [isModal, setIsModal] = useState(false);
  const toggleModal = () => setIsModal(!isModal);
  return (
    <div className="product-card-detail" onClick={toggleModal}>
      {!isModal && (
        <>
          <img src={product.image} alt={product.title} />
          <h5>{product.title}</h5>
          <p className="price">€{product.price}</p>
        </>
      )}
      {isModal && (
        <Modal>
          <div className="product-detail-modal">
            <img src={product.image} alt={product.title} />
            <h5>{product.title}</h5>
            <p className="price">€{product.price}</p>
            <p>{product.description}</p>
            <button onClick={toggleModal}>Back to Wishlist</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
