import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {AddToCart} from "../components/Addtocart";
import { Star,StarOff,StarHalf } from "lucide-react";

export default function ProductDisplay() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

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
          <p>4.5 
            <Star className="inline-block w-4 h-4 text-yellow-500 " />
            <Star className="inline-block w-4 h-4 text-yellow-500" />
            <Star className="inline-block w-4 h-4 text-yellow-500" />
            <Star className="inline-block w-4 h-4 text-yellow-500" />
            <StarHalf className="inline-block w-4 h-4 text-yellow-500" />
           
            (120 reviews)
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-lg font-semibold mb-4">${product.price}</p>
          <p>Select size</p>
          <div className="flex space-x-2 mb-4">
          <p className="border p-1 ">1</p>
          <p className="border p-1 ">2</p>
          <p className="border p-1 ">3</p>
          <p className="border p-1 ">4</p>
          <p className="border p-1 ">5</p>
          </div>
          <p className="text-lg font-semibold mb-4">Choose color</p>
          <div className="flex space-x-2 mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-gray-300 cursor-pointer"></div>
          </div>
          <AddToCart product={product} />
        </div>
      <div className="mt-6">
  <h2 className="text-xl font-bold mb-2">Questions and Answers</h2>
  <div className="border-t border-gray-300 pt-4">
    <p className="text-gray-700">
      Q: Is this bracelet made of real gold or gold-plated? <br />
      A: It is gold-plated with a premium anti-tarnish coating for long-lasting shine.
    </p>

    <p className="text-gray-700 mt-4">
      Q: Can I wear this jewellery daily without it fading? <br />
      A: Yes, it is designed for daily wear and is sweat & water-resistant.
    </p>

    <p className="text-gray-700 mt-4">
      Q: Does it come with a warranty or authenticity certificate? <br />
      A: Yes, it comes with a 6-month warranty and an authenticity certificate.
    </p>
  </div>
</div>

       
      </div>
    </div>
  );
}
