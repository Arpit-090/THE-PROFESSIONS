import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Base from "./pages/Base";
import HomePage from "./pages/HomePage";
import { Outlet } from "react-router-dom";
import Header from "./pages/Header";
import Footer from "./pages/Footer";

function App() {
  return (
     <>
      <div>
      <Header/>
      <Outlet /> 
         {/* when we use AppOrLayout file in main.jsx it only make changrs in outlet not in header or footer bcs we use them as a layout or outlet */}
      <Footer />
    </div>
    </>

    // <div className="min-h-screen bg-gray-50">
    //   <Routes>
    //     {/* Default route → redirect to login */}
    //     <Route path="/" element={<HomePage />} />

    //     {/* Signup Page */}
    //     <Route path="/signup" element={<Signup />} />

    //     {/* Login Page */}
    //     <Route path="/login" element={<Login />} />

    //     {/* Base Page (after login) */}
    //     <Route path="/base" element={<Base />} />

    //     {/* Catch-all route */}
    //     <Route
    //       path="*"
    //       element={<h1 className="text-center text-2xl mt-10">404 - Page Not Found</h1>}
    //     />
    //   </Routes>
    // </div>
  );
}

export default App;
