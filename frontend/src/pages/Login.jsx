import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../store/cartSlice";


export const Login = () => {
  const [step, setStep] = useState(1); // 1: enter email/phone, 2: enter OTP
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Step 1: Request OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!contact) {
      setError("Please enter your email or phone number");
      return;
    }
    setError("");
    setInfo("Sending OTP...");
    // Make API call to request OTP
    fetch("http://localhost:5000/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStep(2);
          setInfo("OTP sent! Please check your email or phone.");
        } else {
          setError(data.message || "Failed to send OTP");
          setInfo("");
        }
      })
      .catch(() => {
        setError("Something went wrong, please try again");
        setInfo("");
      });
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");
    setInfo("Verifying OTP...");
    // Make API call to verify OTP
    fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, otp }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          setInfo("Login successful!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("profileName", contact);
          // window.location.reload();
            const res = await fetch("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${data.token}` }
          });
          const profileData = await res.json();
          if (profileData.success && profileData.user) {
            dispatch(setCart(profileData.user.cart || []));
          }
          navigate("/");
          // Redirect if needed
        } else {
          setError(data.message || "Invalid OTP");
          setInfo("");
        }
      })
      .catch(() => {
        setError("Something went wrong, please try again");
        setInfo("");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login with OTP</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {info && <p className="text-green-600 mb-4">{info}</p>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email or Phone</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter your email or phone"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">OTP</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Verify OTP & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};



// import React, { useState } from "react";
// import {Link }from 'react-router-dom'; 
// export const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     setError("");
//     // Make API call here
//     fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           alert("Login successful!");
//           // Redirect or store token in localStorage/sessionStorage
//           localStorage.setItem("token", data.token);
//         } else {
//           setError(data.message || "Invalid credentials");
//         }
//       })
//       .catch(() => setError("Something went wrong, please try again"));
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Email</label>
//             <input
//               type="email"
//               className="w-full border rounded-lg p-2 mt-1"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Password</label>
//             <input
//               type="password"
//               className="w-full border rounded-lg p-2 mt-1"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-500 mt-4">
//           Don't have an account?{" "}
//           <Link to='/Signup'><button className="text-blue-600 hover:underline">
//             Register
//          </button></Link>
//         </p>
//       </div>
//     </div>
//   );
// };
