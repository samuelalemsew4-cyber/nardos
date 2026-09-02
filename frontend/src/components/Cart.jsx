import React from 'react';

export default function Cart({ cartItems }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <span>{item.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
}
