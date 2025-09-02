// import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("q") || "";

  useEffect(() => {
    if (!query) return;

    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    })();
  }, [query]);

  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold mb-4 ">Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((item) => (
            <li key={item._id} className="border p-2 rounded">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
              <h3 className="font-semibold">{item.name}</h3>
              <p>${item.price}</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
