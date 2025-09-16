import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AddToCart } from "../components/Addtocart";
import { Star, StarHalf } from "lucide-react";
import RatingInput from "../components/RatingInput";

export default function ProductDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rating input state
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check if logged in
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://rayz-2.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Calculate average rating and review count
  const avgRating = product?.ratings?.length
    ? (
        product.ratings.reduce((sum, r) => sum + r.rating, 0) /
        product.ratings.length
      ).toFixed(1)
    : "0.0";
  const reviewCount = product?.ratings?.length || 0;

  // Submit rating and comment
  const handleSubmitRating = async () => {
    if (!userRating) return alert("Please select a rating.");
    if (!token) {
      alert("You must be logged in to submit a review.");
      return navigate("/login");
    }

    setSubmitting(true);

    try {
      const res = await fetch(`https://rayz-2.onrender.com/api/products/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: userRating, comment }),
      });

      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        return navigate("/login");
      }

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setProduct(data.product); // update UI with latest product
        setUserRating(0);
        setComment("");
        alert("Thank you for your review!");
      } else {
        alert("Error submitting review: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting review.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  // Helper to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="inline-block w-4 h-4 text-yellow-500" />
        ))}
        {halfStar && (
          <StarHalf className="inline-block w-4 h-4 text-yellow-500" />
        )}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <Star
            key={i + fullStars + 1}
            className="inline-block w-4 h-4 text-gray-300"
          />
        ))}
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-96 object-cover rounded-2xl shadow"
        />

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p>
            {avgRating} {renderStars(avgRating)} ({reviewCount} reviews)
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-lg font-semibold mb-4">₹{product.price}</p>

          {/* Size Selection */}
          <p>Select size</p>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((size) => (
              <p key={size} className="border p-1 cursor-pointer">
                {size}
              </p>
            ))}
          </div>

          {/* Color Selection */}
          <p className="text-lg font-semibold mb-4">Choose color</p>
          <div className="flex space-x-2 mb-6">
            {["red", "blue", "green", "yellow"].map((color) => (
              <div
                key={color}
                className={`w-8 h-8 bg-${color}-500 rounded-full border-2 border-gray-300 cursor-pointer`}
              ></div>
            ))}
          </div>

          <AddToCart product={product} />
        </div>

        {/* Rating and comment box */}
        <div className="mb-4">
          <h2 className="font-semibold mb-1">Your Rating & Review</h2>
          {token ? (
            <>
              <RatingInput onRate={setUserRating} />
              <textarea
                className="border rounded px-3 py-2 w-full mt-2"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                onClick={handleSubmitRating}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </>
          ) : (
            <p className="text-red-500">
              Please log in to rate and review this product.
            </p>
          )}
        </div>

        {/* Show all reviews */}
        <div className="mb-4">
          <h2 className="font-semibold mb-1">User Reviews</h2>
          {product.ratings && product.ratings.length > 0 ? (
            <ul>
              {product.ratings.map((r, idx) => (
                <li key={idx} className="border-b py-2">
                  <span className="font-bold">{renderStars(r.rating)} </span>
                  <span className="ml-2">{r.comment}</span>
                  {r.user && r.user.name && (
                    <span className="block text-sm text-gray-500 mt-1">
                      - {r.user.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}




// import { useEffect, useState } from "react";
// import { useParams,useNavigate} from "react-router-dom";
// import { AddToCart } from "../components/Addtocart";
// import { Star, StarHalf } from "lucide-react";
// import RatingInput from "../components/RatingInput";

// export default function ProductDisplay() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // For rating input
//   const [userRating, setUserRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//    const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         setProduct(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   // Calculate average rating and review count
//   const avgRating = product?.ratings?.length
//     ? (
//         product.ratings.reduce((sum, r) => sum + r.rating, 0) /
//         product.ratings.length
//       ).toFixed(1)
//     : "0.0";
//   const reviewCount = product?.ratings?.length || 0;

//   // Submit rating and comment
//   const handleSubmitRating = async () => {
//     if (!userRating) return alert("Please select a rating.");
//     setSubmitting(true);

//     const res = await fetch(`http://localhost:5000/api/products/${id}/rate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       },
//       body: JSON.stringify({ rating: userRating, comment })
//     });

//     const data = await res.json();
//     setSubmitting(false);

//     if (data.success) {
//       setProduct(data.product); // update UI with new product data
//       setUserRating(0);
//       setComment("");
//       alert("Thank you for your review!");
//     } else {
//       alert("Error submitting review");
//     }
//   };

//   if (loading) return <div className="p-6 text-center">Loading...</div>;
//   if (!product) return <div className="p-6 text-center">Product not found</div>;

//   // Helper to render stars
//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating - fullStars >= 0.5;
//     return (
//       <>
//         {[...Array(fullStars)].map((_, i) => (
//           <Star key={i} className="inline-block w-4 h-4 text-yellow-500" />
//         ))}
//         {halfStar && <StarHalf className="inline-block w-4 h-4 text-yellow-500" />}
//         {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
//           <Star key={i + fullStars + 1} className="inline-block w-4 h-4 text-gray-300" />
//         ))}
//       </>
//     );
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <img
//           src={product.image || "/placeholder.png"}
//           alt={product.name}
//           className="w-full h-96 object-cover rounded-2xl shadow"
//         />
//         <div>
//           <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
//           <p>
//             {avgRating} {renderStars(avgRating)} ({reviewCount} reviews)
//           </p>
//           <p className="text-gray-700 mb-4">{product.description}</p>
//           <p className="text-lg font-semibold mb-4">₹{product.price}</p>
//           <p>Select size</p>
//           <div className="flex space-x-2 mb-4">
//             <p className="border p-1 ">1</p>
//             <p className="border p-1 ">2</p>
//             <p className="border p-1 ">3</p>
//             <p className="border p-1 ">4</p>
//             <p className="border p-1 ">5</p>
//           </div>
//           <p className="text-lg font-semibold mb-4">Choose color</p>
//           <div className="flex space-x-2 mb-6">
//             <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
//             <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
//             <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
//             <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
//           </div>
//           <AddToCart product={product} />
//         </div>
//         {/* Rating and comment box */}
//         <div className="mb-4">
//           <h2 className="font-semibold mb-1">Your Rating & Review</h2>
//           <RatingInput onRate={setUserRating} />
//           <textarea
//             className="border rounded px-3 py-2 w-full mt-2"
//             placeholder="Write your review here..."
//             value={comment}
//             onChange={e => setComment(e.target.value)}
//             rows={3}
//           />
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded mt-2"
//             onClick={handleSubmitRating}
//             disabled={submitting}
//           >
//             {submitting ? "Submitting..." : "Submit Review"}
//           </button>
//         </div>
//         {/* Show all reviews */}
//         <div className="mb-4">
//           <h2 className="font-semibold mb-1">User Reviews</h2>
//           {product.ratings && product.ratings.length > 0 ? (
//             <ul>
//               {product.ratings.map((r, idx) => (
//                 <li key={idx} className="border-b py-2">
//                   <span className="font-bold">{renderStars(r.rating)} </span>
//                   <span className="ml-2">{r.comment}</span>
//                   {r.user && r.user.name && (
//                     <span className="block text-sm text-gray-500 mt-1">- {r.user.name}</span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No reviews yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
