import React from 'react'

export const Footer = () => {
  return (
    <div className="bg-gray-800 text-white py-4 mt-auto ">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Rayz. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}
