import React, { useEffect, useState } from 'react';
import { AddToCart } from './Addtocart';
import {Link} from 'react-router-dom';
import { Star,StarHalf } from "lucide-react";

export const ProductList = ({ endpoint, heading, emptyText }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  

  const fetchProducts = () => {
    setLoading(true);
    // Build query string
    const params = new URLSearchParams();
    if (sort) params.append('sort', sort);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
  

    fetch(`${endpoint}${params.toString() ? '?' + params.toString() : ''}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [endpoint, sort, minPrice, maxPrice]); // <-- added

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      <div className="mb-4 flex gap-4 items-center">
  <select
    onChange={(e) => setSort(e.target.value)}
    value={sort}
    className="h-12 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm bg-white"
  >
    <option value="">Sort By</option>
    <option value="priceAsc">Price: Low to High</option>
    <option value="priceDesc">Price: High to Low</option>
    <option value="nameAsc">Name: A-Z</option>
    <option value="nameDesc">Name: Z-A</option>
  </select>
  <label className="text-sm font-medium">Price Range:</label>
  <input
    type="number"
    min="0"
    placeholder="Min"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    className="h-12 w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm bg-white"
  />
  <span>-</span>
  <input
    type="number"
    min="0"
    placeholder="Max"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    className="h-12 w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm bg-white"
  />
  


</div>
<div className='mb-4'>
  <p>Showing {items.length} results</p>
</div>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <p>{emptyText || 'No products found.'}</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {items.map(product => (
                    <li key={product._id} className="border p-2 rounded relative">
                      {product.isBestSeller && (
                <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  Best Seller
                </span>
              )}
                     <Link to={`/product/${product._id}`}>
                       <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                     </Link>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p>₹{product.price}</p>
                                 <p >4.5 
            <Star className="inline-block w-4 h-4 text-yellow-500 " />
            <Star className="inline-block w-4 h-4 text-yellow-500" />
            <Star className="inline-block w-4 h-4 text-yellow-500" />
            <Star className="inline-block w-4 h-4 text-yellow-500" />
            <StarHalf className="inline-block w-4 h-4 text-yellow-500" />
           
            (120 reviews)
          </p>
                      <div>
                      <AddToCart product={product} />
                      </div>
            
                    </li>
                  ))}
                </ul>
              )}
             
              {/* Add to Cart Button */}
              
            </div>
          );
        };