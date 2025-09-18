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

// Helper to render stars
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="inline-block w-4 h-4 text-yellow-500" />
      ))}
      {halfStar && <StarHalf className="inline-block w-4 h-4 text-yellow-500" />}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + 1} className="inline-block w-4 h-4 text-gray-300" />
      ))}
    </>
  );
};

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
        {items.map(product => {
          const reviewCount = product.ratings?.length || 0;
          const avgRating = reviewCount
            ? (
                product.ratings.reduce((sum, r) => sum + r.rating, 0) / reviewCount
              ).toFixed(1)
            : "0.0";
          return (
            <li key={product._id} className="border p-2 rounded relative text-base sm:text-xs">
              {product.isBestSeller && (
                <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  Best Seller
                </span>
              )}
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} className="w-full h-40 sm:h-24 object-cover" />
              </Link>
              <h3 className="font-semibold sm:text-xs">{product.name}</h3>
              <p className='sm:text-xs'>₹{product.price}</p>
              <p className='sm:text-xs'>
                {avgRating} {renderStars(avgRating)} ({reviewCount} reviews)
              </p>
              <div>
                <AddToCart product={product}  className="sm:text-xs sm:px-2 sm:py-1" />
              </div>
            </li>
          );
        })}
      </ul>
    )}
    {/* Add to Cart Button */}
  </div>
);
};