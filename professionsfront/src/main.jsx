import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Signup from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Base from "./pages/Base.jsx";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import ContactMe from "./pages/ContactMe.jsx";
import SameInterestUsers from "./pages/SameInterestUsers.jsx";
import ProtectedRoute from "./context/ProtectedRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ChatPage from "./pages/Chatpage.jsx";


const router = createBrowserRouter(           //defining the router variable used in router provider
  [
    {
      path:'/',
      element: <App />,
      children: [
        {
          path:"",
          element:
              <HomePage />
        },
        {
          path:'signup',
          element:<Signup />
        },
        {
          path:"login",
          element:<Login />
        },
        {
          path:"base",
          element:( <ProtectedRoute>
             <Base />
          </ProtectedRoute>
          )
        },
        {
          path:"same-interests",
          element:( <ProtectedRoute>
             <SameInterestUsers />
          </ProtectedRoute>
          )
        },
        {
          path:"profile/:id",
          element:( <ProtectedRoute>
             <ProfilePage />
          </ProtectedRoute>
          )
        },
        {
          path:"chat/:chatId",
          element:( <ProtectedRoute>
             <ChatPage />
          </ProtectedRoute>
          )
        },
        {
          path:"about",
          element:<About />
        },
        {
          path:"contact",
          element:<ContactMe />
        }
      ]
    }
]
)


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
   < RouterProvider router={router} /> 
   </AuthProvider>
  </React.StrictMode>,                     
  // using router provider for importting or rendering the file 
  // because files are not rendering in App.jsx due to use of react router dom    
)

