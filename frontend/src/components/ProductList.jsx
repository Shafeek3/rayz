import React, { useEffect, useState } from 'react';
import { AddToCart } from './Addtocart';

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
  }, [endpoint, sort, minPrice, maxPrice]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      <div className="mb-4 flex gap-4 items-center">
  <select
    onChange={(e) => setSort(e.target.value)}
    value={sort}
    className="h-12 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
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
    className="h-12 w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
  />
  <span>-</span>
  <input
    type="number"
    min="0"
    placeholder="Max"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    className="h-12 w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
  />
</div>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <p>{emptyText || 'No products found.'}</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {items.map(item => (
                    <li key={item._id} className="border p-2 rounded relative">
                      {item.isBestSeller && (
                <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  Best Seller
                </span>
              )}
                      <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>${item.price}</p>
                      <div>
                      <AddToCart />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
             
              {/* Add to Cart Button */}
              
            </div>
          );
        };