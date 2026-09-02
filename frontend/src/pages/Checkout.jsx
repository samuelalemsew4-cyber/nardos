import React, { useState } from "react";
import { ordersAPI } from '../services/api';

export default function Checkout() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerCountry, setCustomerCountry] = useState("Ethiopia");
  const [confirmedName, setConfirmedName] = useState("");
  const [confirmedShippingAddress, setConfirmedShippingAddress] = useState({});
  const [showSlip, setShowSlip] = useState(false);
  const [slipId, setSlipId] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);

  // 1. Order በሚደረግበት ጊዜ
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setShowModal(true); // የስም መጠየቂያ Modal ይከፈታል
  };

  // 2. ስም ሲረጋገጥ ደረሰኙ (Slip) ይፈጠራል
  const handleConfirmName = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return alert("እባክዎን ስምዎን ያስገቡ!");
    if (!customerPhone.trim() || !customerAddress.trim() || !customerCity.trim() || !customerCountry.trim()) {
      return alert("እባክዎን ሙሉ የመላኪያ አድራሻዎን ያስገቡ!");
    }
    if (!localStorage.getItem('token')) return alert('Please log in before placing an order.');

    setSavingOrder(true);
    try {
      const response = await ordersAPI.create({
        shippingAddress: {
          firstName: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          city: customerCity.trim(),
          country: customerCountry.trim()
        },
        paymentMethod: 'Telebirr'
      });
      setConfirmedName(customerName.trim());
      setConfirmedShippingAddress(response.data.order.shippingAddress || {});
      setSlipId(response.data.order.orderNumber);
      setShowModal(false);
      setShowSlip(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to save the order.');
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>የክፍያ እና ማዘዣ ገጽ (Checkout)</h2>

      {!showSlip ? (
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <p>የዕቃዎችን ዝርዝር ያረጋግጡ እና Order ይበሉ</p>
          <button type="submit" className="place-order-btn">
            Order አድርግ 🛒
          </button>
        </form>
      ) : (
        /* 4. ደረሰኝ (Receipt / Slip) */
        <div className="slip-card">
          <h3>🧾 የክፍያ ደረሰኝ (Slip)</h3>
          <p><strong>Slip ID:</strong> {slipId}</p>
          <p><strong>የደንበኛ ስም:</strong> {confirmedName}</p>
          <p><strong>ስልክ:</strong> {confirmedShippingAddress.phone}</p>
          <p><strong>አድራሻ:</strong> {confirmedShippingAddress.address}</p>
          <p><strong>ከተማ:</strong> {confirmedShippingAddress.city}</p>
          <p><strong>አገር:</strong> {confirmedShippingAddress.country}</p>
          <p><strong>ሁኔታ:</strong> ተጠናቋል (Completed)</p>
          <button onClick={() => window.print()} className="print-btn">
            ደረሰኙን Print አድርግ 🖨️
          </button>
        </div>
      )}

      {/* 3. የስም ማረጋገጫ Pop-up Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>ስምዎን ያረጋግጡ</h3>
            <p>ለደረሰኝ (Slip) ዝግጅት እባክዎን ሙሉ ስምዎን ያስገቡ፡</p>
            <form onSubmit={handleConfirmName}>
              <input
                type="text"
                placeholder="ሙሉ ስም ያስገቡ..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="ስልክ ቁጥር"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="ሙሉ የመኖሪያ አድራሻ"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="ከተማ"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="አገር"
                value={customerCountry}
                onChange={(e) => setCustomerCountry(e.target.value)}
                required
              />
              <button type="submit" className="confirm-btn">
                {savingOrder ? 'በማስቀመጥ ላይ...' : 'አረጋግጥ እና ደረሰኝ እይ 📄'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
