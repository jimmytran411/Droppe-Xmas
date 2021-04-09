import { IProduct } from 'api/wishList';
import React from 'react';

export const Product = (product: IProduct) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h1>{product.title}</h1>
      <p className="price">€{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};
