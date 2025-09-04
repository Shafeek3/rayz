import React,{useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useNavigate,useLocation } from 'react-router-dom';
import { updateQuantity} from '../store/cartSlice'; // <-- add updateQuantity

  export default function Checkout() {
  const location = useLocation();
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const buyNowProduct = location.state?.buyNowProduct;
  const [buyNowQty, setBuyNowQty] = useState(buyNowProduct ? buyNowProduct.quantity : 1);
  const items = buyNowProduct
    ? [{ ...buyNowProduct, quantity: buyNowQty }]
    : cart;

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    alert('Order placed successfully!');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {items.map((item, idx) => (
             <li key={idx} className="flex items-center justify-between mb-2">
  <span>{item.name}</span>
  <div className="flex items-center gap-2">
   <button
  className="px-2 py-1 bg-gray-200 rounded"
  onClick={() => {
    if (buyNowProduct) {
      if (buyNowQty > 1) setBuyNowQty(buyNowQty - 1);
    } else {
      if (item.quantity > 1)
        dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
    }
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
    if (buyNowProduct) {
      setBuyNowQty(qty > 0 ? qty : 1); // <-- update local state for Buy Now
    } else {
      dispatch(updateQuantity({ id: item._id, quantity: qty > 0 ? qty : 1 }));
    }
  }}
  className="w-12 text-center border rounded"
  aria-label={`Quantity for ${item.name}`}
/>
<button
  className="px-2 py-1 bg-gray-200 rounded"
  onClick={() => {
    if (buyNowProduct) {
      setBuyNowQty(buyNowQty + 1); // <-- update local state for Buy Now
    } else {
      dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }));
    }
  }}
  aria-label="Increase quantity"
>
  +
</button>
    <span className="ml-4">${(item.price * item.quantity).toFixed(2)}</span>
  </div>
</li> 


            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800 font-semibold"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}