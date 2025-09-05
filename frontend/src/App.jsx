import React,{useEffect,useRef} from "react"; 
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './components/Appcontent';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCart } from './store/cartSlice';
 import './App.css'
 function App() {

const cart = useSelector(state => state.cart);
const hydrated = useRef(false);
const dispatch = useDispatch();

useEffect(() => {
  const fetchCartFromDB = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setCart([])); // Clear cart if logged out
      hydrated.current = true;
      return;
    }
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.user) {
      dispatch(setCart(data.user.cart || []));
    }
    hydrated.current = true;
  };
  fetchCartFromDB();
}, [dispatch, localStorage.getItem("token")]); // <-- rerun when token changes

useEffect(() => {
  const saveCartToDB = async () => {
     if (!hydrated.current) return; // <-- only save after hydration
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("http://localhost:5000/api/auth/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ cart })
    });
  };
  saveCartToDB();
}, [cart]);
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;