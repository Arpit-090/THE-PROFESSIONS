import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import  {AuthContext}  from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { login,accessstoken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    identifier: "", // username or email
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/v1/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log(result);
      if (res.ok) {
        alert("Login Successful 🎉");
        const {user}  = result;
        console.log(result.message)
        console.log(result.message.accessToken)  // use refresh token instead
        login(user)
        accessstoken(result.message.accessToken)
        navigate('/same-interests')
        // localStorage.setItem("token", result.token);  // agar token mil raha hai
      } else {
        alert(result.message || "Login failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Login to THE PROFESSION
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username or Email */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        {/* Extra Links */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
