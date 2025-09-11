import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, updateQuantity } from "../store/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout() {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Address state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setName(data.user.name || "");
        setPhone(data.user.mobile || "");
        setAddress(data.user.address || "");
      }
    };
    fetchProfile();
  }, []);

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID; // <-- Add here
  console.log("Razorpay Key:", razorpayKey); // <-- Add here
  // Buy Now support
  const buyNowProduct = location.state?.buyNowProduct;
  const [buyNowQty, setBuyNowQty] = useState(buyNowProduct ? buyNowProduct.quantity : 1);

  // Items to show in summary
  const items = buyNowProduct
    ? [{ ...buyNowProduct, quantity: buyNowQty }]
    : cart;

  // Calculate total and shipping
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 100;
  const total = subtotal + shipping;

  // Razorpay integration
  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill in all address fields.");
      return;
    }
    // if (paymentMethod === "Card" && !cardNumber) {
    //   alert("Please enter your card number.");
    //   return;
    // }
    // if (paymentMethod === "UPI" && !upiId) {
    //   alert("Please enter your UPI ID.");
    //   return;
    // }

    // Create Razorpay order on backend
    const res = await fetch("http://localhost:5000/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, currency: "INR" })
    });

     const options = {
      key: razorpayKey,
      
    };
    const order = await res.json();
    if (!order.id) {
      alert("Payment initialization failed.");
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Rayz",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // Place order after successful payment
          const token = localStorage.getItem("token");
          const orderRes = await fetch("http://localhost:5000/api/auth/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              items,
              total,
              address: { name, phone, address },
              paymentMethod,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const data = await orderRes.json();
          if (data.success) {
            dispatch(clearCart());
            alert("Order placed successfully!");
            navigate("/orders");
          } else {
            alert("Failed to place order");
          }
        },
        prefill: {
          name,
          email: "",
          contact: phone
        },
        theme: { color: "#3399cc" },
        method: {
          netbanking: true,
          card: true,
          upi: true
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="w-full flex justify-between flex-col md:flex-row gap-6">
        {/* Delivery Address */}
        <div className="mb-6 w-full">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full mb-2"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            className="border rounded px-3 py-2 w-full mb-2"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 w-full mb-2"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
        {/* Order Summary */}
        <div className="mb-6 w-full">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <ul>
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between py-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span className="ml-9">₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <span className="flex justify-between font-semibold mt-4">
            Shipping: {shipping === 0 ? <span className="text-green-600 ml-auto">Free</span> : <span>₹100</span>}
          </span>
          <div className="flex justify-between font-bold mt-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Payment Section */}
      <div className="w-full md:w-1/2 gap-4 mt-6">
        {/* <div className="mb-6">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-2"
          >
            <option value="Card">Credit/Debit Card</option>
            <option value="UPI">UPI</option>
          </select>
          {paymentMethod === "Card" && (
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="Card Number"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
            />
          )}
          {paymentMethod === "UPI" && (
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="UPI ID"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
            />
          )}
        </div> */}
        {/* Place Order Button */}
        <button
          className="bg-green-600 text-white px-6 py-3 rounded font-semibold w-full text-lg hover:bg-green-700"
          onClick={handlePlaceOrder}
        >
          Pay & Place Order
        </button>
      </div>
    </div>
  );
}