import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/auth/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

   // --- Add clear orders handler ---
  const handleClearOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("/api/auth/clear-orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setOrders([]); // Clear orders in UI
      alert("All orders cleared!");
    } else {
      alert("Failed to clear orders.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
       {orders.length > 0 && (
        <button
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
          onClick={handleClearOrders}
        >
          Clear Orders
        </button>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
        
           {[...orders].reverse().map((order, idx) => {
            const orderDate = new Date(order.date);
            const expectedArrival = new Date(orderDate);
            expectedArrival.setDate(orderDate.getDate() + 5);
            return (
              <li key={idx} className="border rounded p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Order #{orders.length - idx}</span>
                  <span className={`px-2 py-1 rounded text-white ${order.status === "Placed" ? "bg-yellow-500" : order.status === "Shipped" ? "bg-blue-500" : order.status === "Delivered" ? "bg-green-600" : "bg-gray-400"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">Date: {orderDate.toLocaleString()}</div>
                {/* Delivering to */}
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Delivering to:</span>
                  <br />
                  {order.address || "No address available"}
                </div>
                {/* Expected arrival */}
                <div className="text-sm text-green-700 mb-2">
                  <span className="font-semibold">Estimated arrival date:</span>{" "}
                  {expectedArrival.toLocaleDateString()}
                </div>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="font-bold mt-2">Total: ₹{order.total.toFixed(2)}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Orders;