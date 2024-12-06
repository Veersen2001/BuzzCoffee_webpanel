import React from 'react'

function ProductModel({ product, onClose }) {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <button className="close-btn" onClick={onClose}>X</button>
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
          </div>
      </div>
  )
}

export default ProductModel