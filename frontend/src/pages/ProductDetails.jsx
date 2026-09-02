import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { cartAPI, getImageUrl, ordersAPI, productsAPI } from '../services/api';

const paymentMethods = [
  { id: 1, name: 'Telebir(0988338401)', icon: '📱', color: '#FF6B00', description: 'Mobile Money Payment' },
  { id: 2, name: 'CBE(100603243009)', icon: '🏦', color: '#0066CC', description: 'Commercial Bank of Ethiopia' },
  { id: 3, name: 'Abay(07123546)', icon: '💳', color: '#00A651', description: 'Bank Transfer' },
  { id: 4, name: 'e-Mpesa(0712546787)', icon: '💰', color: '#00A050', description: 'Mobile Money' },
];

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerCity, setBuyerCity] = useState('');
  const [buyerCountry, setBuyerCountry] = useState('Ethiopia');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productsAPI.getById(productId);
        setProduct(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load product from MongoDB.');
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) {
    return <div className="product-details-page">{error || 'Loading product...'}</div>;
  }

  const priceNumber = typeof product.price === 'number'
    ? product.price
    : Number(product.price.replace(/[^\d]/g, ''));
  const totalPrice = priceNumber * quantity;

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please log in before adding items to your cart.');
      return;
    }

    try {
      await cartAPI.addToCart({ productId: product._id || product.id, quantity });
      alert('Product added to cart.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to add product to cart.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!buyerName.trim()) {
      alert('Please enter the buyer name before completing the purchase.');
      return;
    }

    if (!buyerPhone.trim() || !buyerAddress.trim() || !buyerCity.trim() || !buyerCountry.trim()) {
      alert('Please enter the buyer phone, full address, city, and country before completing the purchase.');
      return;
    }

    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if (!localStorage.getItem('token')) {
      alert('Please log in before completing the purchase.');
      return;
    }

    setOrderPlaced(true);

    try {
      await cartAPI.addToCart({ productId: product._id || product.id, quantity });
      const response = await ordersAPI.create({
        shippingAddress: {
          firstName: buyerName.trim(),
          phone: buyerPhone.trim(),
          address: buyerAddress.trim(),
          city: buyerCity.trim(),
          country: buyerCountry.trim()
        },
        paymentMethod: selectedPayment.id === 1
          ? 'Telebirr'
          : selectedPayment.id === 2
            ? 'CBE'
            : selectedPayment.id === 3
              ? 'Abay'
              : 'e-Mpesa'
      });
      const order = response.data.order;

    const receiptData = {
      orderNumber: order.orderNumber,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerAddress: buyerAddress.trim(),
      buyerCity: buyerCity.trim(),
      buyerCountry: buyerCountry.trim(),
      productName: product.name,
      productBrand: product.brand,
      quantity,
      total: totalPrice,
      paymentMethod: selectedPayment.name,
      date: new Date(order.createdAt).toLocaleString(),
    };

      setReceipt(receiptData);
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setQuantity(1);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to save the order.');
    } finally {
      setOrderPlaced(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!receipt) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nardos Purchase Slip</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f5f5f5; }
            .slip { max-width: 420px; margin: 0 auto; background: #fff; border: 2px solid #d4af37; border-radius: 12px; padding: 22px; }
            .brand { text-align: center; font-size: 26px; letter-spacing: 1px; color: #d4af37; font-weight: 700; margin-bottom: 8px; }
            .title { text-align: center; font-size: 18px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { color: #555; }
            .value { font-weight: 700; text-align: right; }
            .total { font-size: 18px; font-weight: 700; color: #000; }
            .status { display: inline-block; margin-top: 16px; padding: 7px 12px; border-radius: 999px; background: #d4af37; color: #000; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="slip">
            <div class="brand">NARDOS PERFUME</div>
            <div class="title">Purchase Receipt</div>
            <div class="row"><span class="label">Order No.</span><span class="value">${receipt.orderNumber}</span></div>
            <div class="row"><span class="label">Buyer Name</span><span class="value">${receipt.buyerName}</span></div>
            <div class="row"><span class="label">Phone</span><span class="value">${receipt.buyerPhone}</span></div>
            <div class="row"><span class="label">Address</span><span class="value">${receipt.buyerAddress}, ${receipt.buyerCity}, ${receipt.buyerCountry}</span></div>
            <div class="row"><span class="label">Product</span><span class="value">${receipt.productName}</span></div>
            <div class="row"><span class="label">Brand</span><span class="value">${receipt.productBrand}</span></div>
            <div class="row"><span class="label">Quantity</span><span class="value">${receipt.quantity}</span></div>
            <div class="row"><span class="label">Payment</span><span class="value">${receipt.paymentMethod}</span></div>
            <div class="row"><span class="label">Date</span><span class="value">${receipt.date}</span></div>
            <div class="row total"><span class="label">Total</span><span class="value">${receipt.total.toLocaleString()} ETB</span></div>
            <div style="text-align:center;"><span class="status">Paid</span></div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div className="product-details-page">
      {/* Product Details Container */}
      <div className="product-details-container">
        {/* Product Image */}
        <div className="product-image-section">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="product-detail-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getImageUrl();
            }}
          />
          <span className="product-category-badge">{product.category}</span>
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <div className="product-header">
            <span className="product-brand">{product.brand}</span>
            <h1 className="product-name">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="review-count">(156 reviews)</span>
          </div>

          {/* Description */}
          <p className="product-description">{product.description}</p>

          {/* Price */}
          <div className="product-price-section">
            <span className="product-price">{product.price}</span>
            <span className="in-stock">✓ In Stock</span>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <span className="total-price">Total: {priceNumber.toLocaleString()} × {quantity} = {totalPrice.toLocaleString()} ETB</span>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>
            <button 
              className="buy-now-btn"
              onClick={() => setShowPaymentModal(true)}
            >
              💳 Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="product-details-info">
            <h3>Product Details</h3>
            <ul>
              <li><strong>Brand:</strong> {product.brand}</li>
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Price:</strong> {product.price}</li>
              <li><strong>Availability:</strong> In Stock</li>
              <li><strong>Shipping:</strong> Free on orders over 500 ETB</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Receipt */}
      {receipt && (
        <div className="payment-modal-overlay">
          <div className="payment-receipt">
            <div className="receipt-header">
              <div>
                <p className="receipt-brand">NARDOS PERFUME</p>
                <h3>Purchase Receipt</h3>
              </div>
              <span className="receipt-status">Paid</span>
            </div>

            <div className="receipt-body">
              <div className="receipt-row">
                <span>Order No.</span>
                <strong>{receipt.orderNumber}</strong>
              </div>
              <div className="receipt-row">
                <span>Buyer Name</span>
                <strong>{receipt.buyerName}</strong>
              </div>
              <div className="receipt-row">
                <span>Phone</span>
                <strong>{receipt.buyerPhone}</strong>
              </div>
              <div className="receipt-row">
                <span>Address</span>
                <strong>{receipt.buyerAddress}, {receipt.buyerCity}, {receipt.buyerCountry}</strong>
              </div>
              <div className="receipt-row">
                <span>Product</span>
                <strong>{receipt.productName}</strong>
              </div>
              <div className="receipt-row">
                <span>Brand</span>
                <strong>{receipt.productBrand}</strong>
              </div>
              <div className="receipt-row">
                <span>Quantity</span>
                <strong>{receipt.quantity}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment</span>
                <strong>{receipt.paymentMethod}</strong>
              </div>
              <div className="receipt-row">
                <span>Date</span>
                <strong>{receipt.date}</strong>
              </div>
              <div className="receipt-row total-row">
                <span>Total</span>
                <strong>{receipt.total.toLocaleString()} ETB</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button className="receipt-close" onClick={() => setReceipt(null)}>Close Receipt</button>
              <button className="place-order-btn" onClick={handlePrintReceipt}>Print Slip</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            
            <h2>Select Payment Method</h2>
            <p className="modal-subtitle">Please enter the buyer name before choosing the payment method.</p>

            <div className="buyer-name-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="buyer-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Buyer Name</label>
              <input
                id="buyer-name"
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Enter buyer full name"
                style={{
                  width: '100%',
                  padding: '0.8rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #d4af37',
                  boxSizing: 'border-box',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div className="buyer-name-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="buyer-phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Buyer Phone</label>
              <input id="buyer-phone" type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="Enter buyer phone" required style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '8px', border: '1px solid #d4af37', boxSizing: 'border-box', fontSize: '1rem' }} />
            </div>
            <div className="buyer-name-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="buyer-address" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Address</label>
              <input id="buyer-address" type="text" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} placeholder="Enter full delivery address" required style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '8px', border: '1px solid #d4af37', boxSizing: 'border-box', fontSize: '1rem' }} />
            </div>
            <div className="buyer-name-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="buyer-city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>City</label>
              <input id="buyer-city" type="text" value={buyerCity} onChange={(e) => setBuyerCity(e.target.value)} placeholder="Enter city" required style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '8px', border: '1px solid #d4af37', boxSizing: 'border-box', fontSize: '1rem' }} />
            </div>
            <div className="buyer-name-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="buyer-country" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Country</label>
              <input id="buyer-country" type="text" value={buyerCountry} onChange={(e) => setBuyerCountry(e.target.value)} placeholder="Enter country" required style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '8px', border: '1px solid #d4af37', boxSizing: 'border-box', fontSize: '1rem' }} />
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-item">
                <span>Product:</span>
                <span>{product.name}</span>
              </div>
              <div className="summary-item">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>{totalPrice.toLocaleString()} ETB</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`payment-method-card ${selectedPayment?.id === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect(method)}
                  style={selectedPayment?.id === method.id ? { borderColor: method.color, backgroundColor: `${method.color}15` } : {}}
                >
                  <div className="payment-icon" style={{ fontSize: '2rem' }}>
                    {method.icon}
                  </div>
                  <div className="payment-info">
                    <div className="payment-name">{method.name}</div>
                    <div className="payment-description">{method.description}</div>
                  </div>
                  {selectedPayment?.id === method.id && (
                    <div className="payment-checkmark">✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button 
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={!selectedPayment || orderPlaced}
              >
                {orderPlaced ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
