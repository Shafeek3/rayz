import { useState } from "react";

export default function FilterSort({ onFilterChange }) {
  const [priceRange, setPriceRange] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleChange = () => {
    onFilterChange({ priceRange, sortOrder });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      {/* Price Range */}
      <select
        className="border p-2 rounded-lg"
        value={priceRange}
        onChange={(e) => {
          setPriceRange(e.target.value);
          handleChange();
        }}
      >
        <option value="">All Prices</option>
        <option value="0-500">₹0 - ₹500</option>
        <option value="500-1000">₹500 - ₹1000</option>
        <option value="1000-2000">₹1000 - ₹2000</option>
        <option value="2000+">₹2000+</option>
      </select>

      {/* Sort Order */}
      <select
        className="border p-2 rounded-lg"
        value={sortOrder}
        onChange={(e) => {
          setSortOrder(e.target.value);
          handleChange();
        }}
      >
        <option value="">Sort by</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>
  );
}
