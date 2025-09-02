import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AddToCart } from "./Addtocart";

export default function NewArrivals() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/new-arrivals").then((res) => setData(res.data));
  }, []);

  return (
    <div className="mt-12 px-4 md:px-8">
      <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.map((product) => (
          <div
            key={product._id || product.id}
            className="   shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full object-cover  group-hover:scale-105 transition-transform duration-300"
              />
              <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
            </Link>
            <p className="mt-1 text-lg font-bold text-gray-800">${product.price}</p>
           <AddToCart product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
