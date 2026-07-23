import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Base from "./pages/Base.jsx";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import ContactMe from "./pages/ContactMe.jsx";
import SameInterestUsers from "./pages/SameInterestUsers.jsx";
import ProtectedRoute from "./context/ProtectedRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WebRtcProvider } from "./webRTC/webRTCContext.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ChatPage from "./pages/Chatpage.jsx";
import LoggedInUser from "./pages/LoggedInUser.jsx";
import AllChats from "./pages/AllChats.jsx";
import Call from "./pages/Call.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <ContactMe /> },
      {
        path: "base",
        element: <ProtectedRoute><Base /></ProtectedRoute>,
      },
      {
        path: "same-interests",
        element: <ProtectedRoute><SameInterestUsers /></ProtectedRoute>,
      },
      {
        path: "profile/:userId",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: "getprofile",
        element: <ProtectedRoute><LoggedInUser /></ProtectedRoute>,
      },
      {
        path: "chat/:chatId",
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
      },
      {
        path: "all-chats",
        element: <ProtectedRoute><AllChats /></ProtectedRoute>,
      },
      {
        path: "call/:userId",
        element: <ProtectedRoute><Call /></ProtectedRoute>,
      },
    ],
  },
]);

// ✅ StrictMode REMOVED — it double-invokes effects which breaks WebRTC setup
// StrictMode runs useEffect twice in dev, causing duplicate PC creation,
// duplicate tracks, and stale ontrack callbacks pointing to unmounted refs
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <WebRtcProvider>
      <RouterProvider router={router} />
    </WebRtcProvider>
  </AuthProvider>
);
