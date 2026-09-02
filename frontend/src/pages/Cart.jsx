import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI, getImageUrl } from '../services/api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }

      try {
        const response = await cartAPI.getCart();
        setCartItems(response.data.items || []);
      } catch (error) {
        alert(error.response?.data?.message || 'Unable to load your cart.');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    cartAPI.updateItem(id, { productId: id, quantity: newQuantity })
      .then(response => setCartItems(response.data.cart.items || []))
      .catch(error => alert(error.response?.data?.message || 'Unable to update your cart.'));
  };

  const removeItem = (id) => {
    cartAPI.removeItem(id)
      .then(response => setCartItems(response.data.cart.items || []))
      .catch(error => alert(error.response?.data?.message || 'Unable to remove the item.'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  const total = calculateTotal();

  if (loading) return <div className="cart-page"><h1>Loading cart...</h1></div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Review and manage your perfume selection</p>
      </div>

      <div className="container">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-box">
              <p>Your cart is empty</p>
              <p className="empty-subtext">Add some luxurious perfumes to get started!</p>
              <Link to="/search" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => {
                    const productId = item.product?._id || item.product;
                    const itemPrice = Number(item.price);
                    const itemTotal = itemPrice * item.quantity;
                    return (
                      <tr key={productId} className="cart-item-row">
                        <td className="product-cell">
                          <div className="product-info">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = getImageUrl();
                              }}
                            />
                            <div>
                              <h4>{item.name}</h4>
                              <p className="brand">{item.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td>{formatPrice(itemPrice)} ETB</td>
                        <td>
                          <div className="quantity-control">
                            <button onClick={() => updateQuantity(productId, item.quantity - 1)}>−</button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(productId, parseInt(e.target.value) || 1)}
                              min="1"
                            />
                            <button onClick={() => updateQuantity(productId, item.quantity + 1)}>+</button>
                          </div>
                        </td>
                        <td className="total-price">{formatPrice(itemTotal)} ETB</td>
                        <td>
                          <button 
                            className="btn-remove" 
                            onClick={() => removeItem(productId)}
                            title="Remove from cart"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <div className="summary-box">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(total)} ETB</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="shipping">Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax (15%):</span>
                  <span>{formatPrice(Math.round(total * 0.15))} ETB</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>{formatPrice(Math.round(total * 1.15))} ETB</span>
                </div>
                <Link to="/checkout" className="btn btn-checkout">Proceed to Checkout</Link>
                <Link to="/search" className="btn btn-continue">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
