import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart,clearCart} from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

export const AddToCart = ({ product }) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const isAdded = cart.some(item => item._id === product._id);
  const navigate = useNavigate();
  const handleAddToCart = () => {
    if (!isAdded) {
      dispatch(addToCart(product));
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product._id));
  };

   const handleBuyNow = () => {
    navigate('/checkout', { state: { buyNowProduct: { ...product, quantity: 1 } } }); // <-- pass product to checkout
  };

  return (
    <div className="flex items-center gap-2 space-x-2 mb-2">
      <div className="mt-2">
        {isAdded ? (
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md transition"
            onClick={handleRemoveFromCart}
          >
            Remove from Cart
          </button>
        ) : (
          <button
            className="bg-yellow-700 text-white px-4 py-2 rounded-md transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
      <div className="mt-2">
       
          <button className="bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-900 transition"
            onClick={handleBuyNow}>
            Buy Now
          </button>
       
      </div>
    </div>
  );
}