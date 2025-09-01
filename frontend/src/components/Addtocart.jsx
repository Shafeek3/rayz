import React from 'react'

export const AddToCart = () => {
  return (
    <>  
     <div className="flex items-center gap-2 space-x-2 mb-2">
        <div className="mt-2">
          <button className="bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-900 transition">
            Add to Cart
          </button>
        </div>

        <div className="mt-2">
          <button className="bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-900 transition">
            Buy Now
          </button>
        </div>
        </div>
    </>
  )
}
