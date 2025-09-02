import React,{useState,useEffect} from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import { Search,User,ShoppingCart } from "lucide-react"
import "../css/Navbar.css"
import { useSelector } from 'react-redux';
// import logo from "../../assets/images/logo.jpeg" // Add your logo

export const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const[suggestions,setSuggestions]=useState([]);
    const location = useLocation();
    const isHome = location.pathname === "/";

    const cart = useSelector(state => state.cart);
     useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // change background after 50px scroll
    };
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
      const res = await fetch(`http://localhost:5000/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [searchTerm]);

    const navigate = useNavigate()
     const handleSearch = () => {
    if (searchTerm.trim() === "") return
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }
  return (
    <div   className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4 transition-all duration-300
    ${isHome && !scrolled
      ? "bg-transparent text-white"
      : "bg-white text-black shadow-md"
    }`}
>
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        {/* <img src={logo} alt="Logo" className="h-10 w-auto" /> */}
       <h1 className="text-2xl md:text-4xl font-bold tracking-widest">Rayz</h1>

      </Link>

      {/* Search Box */}
      <div className="relative w-64">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full border rounded-md p-2 pl-10"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white text-black shadow-md rounded-md mt-1 z-50">
            {suggestions.map((item, idx) => (
             <li
  key={idx}
  onClick={() => {
    console.log(item.id);
    navigate(`/product/${item.id}`);
    setSuggestions([]); // Hide suggestions after click
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
      {/* Navigation Links */}
      <nav>
        <ul className="flex space-x-8 font-medium">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/New" className="hover:underline">New</Link></li>
          <li><Link to="/Rings" className="hover:underline">Rings</Link></li>
          <li><Link to="/earrings" className="hover:underline">Earrings</Link></li>
          <li><Link to="/bracelets" className="hover:underline">Bracelets</Link></li>
          <li><Link to="/necklace" className="hover:underline">Necklace</Link></li>
          <li><Link to="/bangles" className="hover:underline">Bangles</Link></li>
          <li><Link to="/anklets" className="hover:underline">Anklets</Link></li>
          <li><Link to="/login" className="hover:underline navlogin"> <User className="w-5 h-5 " />
            <span>Login</span></Link></li> 
         <li>
                <Link to="/cart" className="hover:underline navcart relative flex items-center">
                  <div className="relative flex flex-col items-center">
                    {/* Cart count badge */}
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
        </ul>
      </nav>
    </div>
  )
}
