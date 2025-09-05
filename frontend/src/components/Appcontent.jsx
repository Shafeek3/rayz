import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route}from'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { New } from '../pages/New'
import { Rings } from '../pages/Rings'
import { Earrings } from '../pages/Earrings'
import { Bracelets } from '../pages/Bracelets'
import { Necklace } from '../pages/Necklace'
import { Bangles } from '../pages/Bangles'
import { Anklets } from '../pages/Anklets'
import { Login } from '../pages/Login'
import { Signup } from '../pages/Signup'
import Cart  from '../pages/Cart'
import SearchPage  from '../pages/SearchPage'
import { Hero } from './Hero'
import ProductDispaly from '../pages/ProductDisplay'
import { Footer } from './Footer'
import Checkout from '../pages/Checkout'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'

function Appcontent() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
    <div className="min-h-screen flex flex-col">
     
      <Navbar/>
      <div className={`flex-1 ${isHome ? "" : "pt-20"}`}>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/New" element={<New />} />
        <Route path="/Rings" element={<Rings />} />
        <Route path="/earrings" element={<Earrings />} />
        <Route path="/bracelets" element={<Bracelets />} />
        <Route path="/necklace" element={<Necklace />} />
        <Route path="/bangles" element={<Bangles />} />
        <Route path="/anklets" element={<Anklets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<Checkout />} />

       
       <Route path="/product/:id" element={<ProductDispaly />} />
      <Route path="/profile" element={<Profile />} />
<Route path="/orders" element={<Orders />} />
      </Routes>

      </div>
      <Footer /> 
      </div>
    </>
  )
}

export default Appcontent
