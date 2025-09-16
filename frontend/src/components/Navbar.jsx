import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import "../css/Navbar.css";
import { clearCart } from "../store/cartSlice";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileName = localStorage.getItem("profileName") || "";
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileName");
    dispatch(clearCart());
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://rayz-2.onrender.com/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") return;
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const isHome = location.pathname === "/";

  // All categories for menu
  const categories = [
    { name: "Home", path: "/" },
    { name: "New", path: "/New" },
    { name: "Rings", path: "/Rings" },
    { name: "Earrings", path: "/earrings" },
    { name: "Bracelets", path: "/bracelets" },
    { name: "Necklace", path: "/necklace" },
    { name: "Bangles", path: "/bangles" },
    { name: "Anklets", path: "/anklets" },
  ];
  
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    isAdmin = payload.isAdmin;
  } catch {}
  }



  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 transition-all duration-300
      ${isHome && !scrolled ? "bg-transparent text-white" : "bg-white text-black shadow-md"}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <h1 className="text-2xl md:text-4xl font-bold tracking-widest">Rayz</h1>
      </Link>

      {/* Search Box */}
      <div className="relative w-40 md:w-64 mx-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full border rounded-md p-2 pl-10"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
        >
          <Search className="w-5 h-5" />
        </button>
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white text-black shadow-md rounded-md mt-1 z-50">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  setSuggestions([]);
                  setSearchTerm("");
                }}
                className="p-2 hover:bg-gray-400 cursor-pointer"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hamburger for mobile */}
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mr-2"
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7" />
        </button>
        {/* Login/Profile */}
        {!profileName ? (
          <Link to="/login" className="hover:underline navlogin flex items-center space-x-1">
            <User className="w-5 h-5" />
            <span>Login</span>
          </Link>
        ) : (
          <div className="relative">
            <span
              className="cursor-pointer font-semibold"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              My Profile
            </span>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate("/profile")}
                >
                  Address
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        {/* Cart */}
        <Link to="/cart" className="hover:underline navcart relative flex items-center ml-2">
          <div className="relative flex flex-col items-center">
            {cart.length > 0 && (
              <span className="absolute -top-4 left-6 -translate-x-1/2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {cart.length}
              </span>
            )}
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="ml-1">Cart</span>
        </Link>

        {isAdmin && (
        <Link to="/admin" className="font-bold text-red-600 ml-2">Admin</Link>
      )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex">
        <ul className="flex space-x-8 font-medium flex-wrap">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link to={cat.path} className="hover:underline">{cat.name}</Link>
            </li>
          ))}
          {/* User Profile / Login */}
          {!profileName ? (
            <li>
              <Link to="/login" className="hover:underline navlogin flex items-center space-x-1">
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </li>
          ) : (
            <li className="relative">
              <div
                className="inline-block"
                onMouseEnter={() => {
                  clearTimeout(window.profileMenuTimeout);
                  setShowProfileMenu(true);
                }}
                onMouseLeave={() => {
                  window.profileMenuTimeout = setTimeout(() => setShowProfileMenu(false), 150);
                }}
              >
                <span className="cursor-pointer font-semibold">My Profile</span>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black border rounded shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/profile")}
                    >
                      Address
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/orders")}
                    >
                      Orders
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </li>
          )}
          {/* Cart */}
          <li>
            <Link to="/cart" className="hover:underline navcart relative flex items-center">
              <div className="relative flex flex-col items-center">
                {cart.length > 0 && (
                  <span className="absolute -top-4 left-6 -translate-x-1/2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="ml-1">Cart</span>
            </Link>
          </li>
          {isAdmin && (
          <li>
            <Link to="/admin" className="font-bold text-red-600">Admin</Link>
          </li>
        )}
        </ul>
      </nav>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="fixed top-16 left-0 w-full bg-white text-black shadow-lg z-50 md:hidden">
          <ul className="flex flex-col font-medium">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  to={cat.path}
                  className="block px-6 py-3 hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Search, User, ShoppingCart, Blocks } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import "../css/Navbar.css";
// import { clearCart } from "../store/cartSlice";

// export const Navbar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [scrolled, setScrolled] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const profileName = localStorage.getItem("profileName") || "";
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const cart = useSelector((state) => state.cart);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("profileName");
//     dispatch(clearCart());
//     navigate("/");
//      window.location.reload();
//   };
//   // Track scroll for navbar style change
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Fetch search suggestions
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setSuggestions([]);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`
//         );
//         const data = await res.json();
//         setSuggestions(data);
//       } catch (err) {
//         console.error("Suggestion fetch error:", err);
//       }
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [searchTerm]);

//   const handleSearch = () => {
//     if (searchTerm.trim() === "") return;
//     navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//   };

//   const isHome = location.pathname === "/";

//   // All categories for menu
//   const categories = [
//     { name: "Home", path: "/" },
//     { name: "New", path: "/New" },
//     { name: "Rings", path: "/Rings" },
//     { name: "Earrings", path: "/earrings" },
//     { name: "Bracelets", path: "/bracelets" },
//     { name: "Necklace", path: "/necklace" },
//     { name: "Bangles", path: "/bangles" },
//     { name: "Anklets", path: "/anklets" },
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 transition-all duration-300
//       ${
//         isHome && !scrolled
//           ? "bg-transparent text-white"
//           : "bg-white text-black shadow-md"
//       }`}
//     >
//       {/* Logo */}
//       <Link to="/" className="flex items-center space-x-2">
//         <h1 className="text-2xl md:text-4xl font-bold tracking-widest">Rayz</h1>
//       </Link>

//       {/* Search Box */}
//       <div className="relative w-64">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search..."
//           className="w-full border rounded-md p-2 pl-10"
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <button
//           onClick={handleSearch}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
//         >
//           <Search className="w-5 h-5" />
//         </button>

//         {/* Suggestions Dropdown */}
//         {suggestions.length > 0 && (
//           <ul className="absolute top-full left-0 w-full bg-white text-black shadow-md rounded-md mt-1 z-50">
//             {suggestions.map((item, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => {
//                   navigate(`/product/${item.id}`);
//                   setSuggestions([]);
//                   setSearchTerm("");
//                 }}
//                 className="p-2 hover:bg-gray-400 cursor-pointer"
//               >
//                 {item.name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Navigation Links */}
//       <nav>
//         <ul className="flex space-x-8 font-medium flex-wrap">
//           <li><Link to="/" className="hover:underline">Home</Link></li>
//           <li><Link to="/New" className="hover:underline">New</Link></li>
//           <li><Link to="/Rings" className="hover:underline">Rings</Link></li>
//           <li><Link to="/earrings" className="hover:underline">Earrings</Link></li>
//           <li><Link to="/bracelets" className="hover:underline">Bracelets</Link></li>
//           <li><Link to="/necklace" className="hover:underline">Necklace</Link></li>
//           <li><Link to="/bangles" className="hover:underline">Bangles</Link></li>
//           <li><Link to="/anklets" className="hover:underline">Anklets</Link></li>

//           {/* User Profile / Login */}
//           {!profileName ? (
//             <li>
//               <Link to="/login" className="hover:underline navlogin flex items-center space-x-1">
//                 <User className="w-5 h-5" />
//                 <span>Login</span>
//               </Link>
//             </li>
//           ) : (
//            <li className="relative">
//   <div
//     className="inline-block"
//      onMouseEnter={() => {
//       clearTimeout(window.profileMenuTimeout);
//       setShowProfileMenu(true);
//     }}
//     onMouseLeave={() => {
//       window.profileMenuTimeout = setTimeout(() => setShowProfileMenu(false), 150);
//     }}
//   >
//     <span className="cursor-pointer font-semibold">My Profile</span>
//     {showProfileMenu && (
//       <div className="absolute right-0 mt-2 w-48 bg-white text-black border rounded shadow-lg z-50">
//         <button
//           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//           onClick={() => navigate("/profile")}
//         >
//           Address
//         </button>
//         <button
//           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//           onClick={() => navigate("/orders")}
//         >
//           Orders
//         </button>
//         <button
//           className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     )}
//   </div>
// </li>
//           )}

//           {/* Cart */}
//           <li>
//             <Link to="/cart" className="hover:underline navcart relative flex items-center">
//               <div className="relative flex flex-col items-center">
//                 {cart.length > 0 && (
//                   <span className="absolute -top-4 left-6 -translate-x-1/2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
//                     {cart.length}
//                   </span>
//                 )}
//                 <ShoppingCart className="w-5 h-5" />
//               </div>
//               <span className="ml-1">Cart</span>
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };
