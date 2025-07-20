// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getAuthData, saveAuthData, clearAuthData } from "./auth.utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
    

  useEffect(() => {
    const stored = getAuthData();
    if (stored) setAuth(stored); // load from localStorage on page refresh
   
  }, []);

  const login = (data) => {
    saveAuthData(data); // localStorage ✅
    setAuth(data);      // context state ✅
  };

  const logout = () => {
    clearAuthData();   // localStorage ✅
    setAuth(null);     // context state ✅
  };

 const isAuthenticated = !!auth?.user; // ✅ this line gives you a simple true/false flag

  return (
    <AuthContext.Provider value={{ auth, login, logout,isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
