import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AddToCart } from "./Addtocart";

export const BestSellers = () => {
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/products/best-sellers");

      // If API response is not an array, default to empty array
      return Array.isArray(res.data) ? res.data : [];
    },
     staleTime: 0,
  refetchOnWindowFocus: true,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Best Sellers</h2>
        <p className="text-red-500">Error: {error?.message || "Failed to load best sellers"}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Best Sellers</h2>
        <p>No best sellers available right now.</p>
      </div>
    );
  }

  return (
  
    <div className="mt-12 px-4 md:px-8">
  <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">
    Best Sellers
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {data.map((product) => (
      <div
        key={product._id || product.id}
        className="bg-white  shadow-md hover:shadow-xl transition-shadow duration-300  group cursor-pointer"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-80 w-full object-cover  group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            Best Seller
          </span>
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-lg font-bold text-gray-800">${product.price}</p>
        <div className="mt-2 mb-4">
          <AddToCart />
        </div>
      </div>
    ))}
  </div>
</div>

  );
};
