import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity,clearCart } from '../store/cartSlice';
import emptybag from '../assets/rayz-images/emptybag.jpg';

export default function Cart() {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className={cart.length > 0 ?'flex justify-between mb-8':'text-center mb-8'}>
      <h2 className="text-2xl font-bold mb-4">{cart.length > 0 ? `Your cart has ${cart.length} items` : 'Your cart is empty.'}</h2>
      <button className={cart.length > 0 ? 'bg-red-500 text-white px-1 py-1 rounded  hover:bg-red-700' : 'hidden'} onClick={() => dispatch(clearCart())}>{cart.length > 0 ? 'Clear Cart' : ''}</button>
      </div>

      {cart.length === 0 ? (
        <div className='text-center'>
          <h3 className='text-lg font-semibold'>Hey it feels so light!</h3>
          <img src={emptybag} alt="Empty cart" />
          <p>There is nothing in your cart. Let's add some items!</p>
        </div>
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
               
                <div className="flex items-center gap-2"> 
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => {
                    if (item.quantity > 1)
                      dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
                  }}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => {
                    const qty = Number(e.target.value);
                    dispatch(updateQuantity({ id: item._id, quantity: qty > 0 ? qty : 1 }));
                  }}
                  className="w-12 text-center border rounded"
                  aria-label={`Quantity for ${item.name}`}
                />
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => {
                    dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }));
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

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