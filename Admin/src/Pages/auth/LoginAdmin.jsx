import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext"

import {useContext, useState, useEffect} from "react";
import API from "../../services/Api";

const LoginAdmin =  () => {
  const navigate = useNavigate();
  const { login } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if(!email || !password){
      alert("Please fill out all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      alert("Please enter a valid email address");
      return;
   }
   try {
    const loginData = { email: email.trim(), password };
    console.log("Login Data:", loginData);
    const res = await API.loginAccountAPI(loginData);

    await login(email, password);
    console.log("Login successful:", res.data);
    navigate("/dashboard");


   } catch (error) {
    // Prevent crashes if error.response is undefined
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";

    console.error("Login error:", msg, error);

    alert(msg);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          DermaScan+ Admin
        </h2>
            <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Login
      </button>
    </form>
        <p className="mt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Admin Portal
        </p>
      </div>
    </div>
  );
};

export default LoginAdmin;
