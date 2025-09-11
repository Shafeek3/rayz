import React, { useState } from "react";
import { Star } from "lucide-react";

export default function RatingInput({ onRate }) {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[1,2,3,4,5].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => {
            setRating(num);
            if (onRate) onRate(num);
          }}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 ${num <= rating ? "text-yellow-500" : "text-gray-300"}`}
            fill={num <= rating ? "#facc15" : "none"}
          />
        </button>
      ))}
      <span className="ml-2 text-sm">{rating > 0 ? `${rating} / 5` : "Rate this product"}</span>
    </div>
  );
}