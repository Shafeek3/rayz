import React, { useState, useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux';
import { setCart } from '../store/cartSlice';

export default function Profile() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [postcode, setPostcode] = useState("");
  const [place, setPlace] = useState("");
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.user) {
      dispatch(setCart(data.user.cart || [])); // <-- set cart in Redux
      // ...set other fields if needed...
    }
  };
  fetchProfile();
}, []);
  // Fetch profile info on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setName(data.user.name || "");
        setMobile(data.user.mobile || "");
        setPostcode(data.user.postcode || "");
        setPlace(data.user.place || "");
        setLandmark(data.user.landmark || "");
        setDistrict(data.user.district || "");
        setState(data.user.state || "");
        setCountry(data.user.country || "");
        setAddress(data.user.address || "");
      }
    };
    fetchProfile();
  }, []);

  // Auto-complete district, state, country from postcode
  const handlePostcodeBlur = async () => {
    if (!postcode) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${postcode}`);
      const data = await res.json();
      if (data[0].Status !== "Success") throw new Error("Invalid postcode");
      const info = data[0].PostOffice?.[0];
      setCountry("India");
      setState(info.State || "");
      setDistrict(info.District || "");
      setPlace(info.Name || "");
    } catch (err) {
      setError("Could not auto-complete address. Please check postcode.");
    }
    setLoading(false);
  };

  // Build full address without empty lines
  const fullAddress = [
    name,
    mobile,
    place,
    landmark,
    district,
    state,
    postcode,
    country
  ].filter(Boolean).join('\n');

  // Save profile info to backend
 // --- Save profile info to backend ---
const handleSave = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in first.");
    return;
  }

  const profileData = {
    name,
    mobile,
    postcode,
    place,
    landmark,
    district,
    state,
    country,
    address: fullAddress // <-- FIXED: send computed address
  };

  try {
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (res.status === 401) { // <-- FIXED: handle unauthorized
      alert("Session expired. Please log in again.");
      return;
    }

    const data = await res.json();
    if (data.success) {
      alert("Profile saved!");
    } else {
      alert(data.message || "Failed to save profile.");
    }
  } catch (err) {
    alert("Network error. Please try again.");
  }
};

// Example: Save cart after adding/removing items
const saveCartToDB = async (cart) => {
  
  const token = localStorage.getItem("token");
  await fetch("http://localhost:5000/api/auth/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ cart })
  });
};

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Mobile Number</label>
        <PhoneInput
          country={'in'}
          value={mobile}
          onChange={setMobile}
          inputClass="w-full"
          inputStyle={{ width: "100%" }}
          placeholder="Enter your mobile number"
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">Address</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Postcode</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={postcode}
          onChange={e => setPostcode(e.target.value)}
          onBlur={handlePostcodeBlur}
          placeholder="Enter your postcode"
        />
        {loading && <span className="text-sm text-gray-500">Checking postcode...</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Place Name <span className="text-gray-400">(optional)</span></label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={place}
          onChange={e => setPlace(e.target.value)}
          placeholder="Place name"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Landmark <span className="text-gray-400">(optional)</span></label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={landmark}
          onChange={e => setLandmark(e.target.value)}
          placeholder="Landmark"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">District</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={district}
          onChange={e => setDistrict(e.target.value)}
          placeholder="District"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">State</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={state}
          onChange={e => setState(e.target.value)}
          placeholder="State"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Country</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          value={country}
          onChange={e => setCountry(e.target.value)}
          placeholder="Country"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Full Address</label>
        <TextareaAutosize
          className="border rounded px-3 py-2 w-full resize-y"
          value={fullAddress}
          minRows={2}
          readOnly
          placeholder="Full address"
        />
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800 font-semibold"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
    );
}

