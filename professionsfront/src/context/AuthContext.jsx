import { createContext, useState } from "react";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [accessToken, setaccessToken] = useState(null); // null = not logged in

  // login function (call this after API success)
  const accessstoken = (token)=>{
    setaccessToken(token)
  }
  const login = (userData) => {
    setUser(userData || true); // store user info or just "true"
  };

  // logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,accessstoken,accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy usage
export  {AuthContext}
