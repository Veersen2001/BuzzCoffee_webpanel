import { createContext, useContext, useEffect, useState } from "react";
import dotenv from "dotenv";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const verifyResponse = await fetch(`${ API_URL}/verify_token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            }
          );
         
          
          const verifyResult = await verifyResponse.json();
          if (verifyResponse.ok) {
            setUser(verifyResult);
            localStorage.setItem("user", JSON.stringify(verifyResult));
          } else {
            console.error("Token verification failed:", verifyResult.message);
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(true);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
