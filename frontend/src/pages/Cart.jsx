import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../store/cartSlice';

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between mb-4 border-b pb-2">
                <Link to={`/product/${item._id}`} className="flex items-center flex-1">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    <div className="text-gray-600 text-sm">${item.price}</div>
                  </div>
                </Link>
                {/* --- quantity input --- */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e =>
                    dispatch(updateQuantity({ id: item._id, quantity: Number(e.target.value) }))
                  }
                  className="w-12 text-center border rounded mx-2"
                  aria-label={`Quantity for ${item.name}`}
                />
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 ml-2"
                  onClick={() => dispatch(removeFromCart(item._id))}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800 font-semibold"
              onClick={() => navigate('/checkout')} // <-- go to checkout
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}