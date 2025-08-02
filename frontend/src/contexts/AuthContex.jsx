import { use, useEffect } from "react";
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");
  const [user, setuser] = useState();

  const login = (token, userRole, user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setuser(user);
    setIsAuth(true);
    setRole(userRole);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setuser(JSON.parse(user));
      setIsAuth(true);
      setRole(JSON.parse(user).id_rol);
    }
  }, []);

  const logout = () => {
    setIsAuth(false);
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("id_rol");
  };

  return (
    <AuthContext.Provider value={{ isAuth, role, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useAuth = () => useContext(AuthContext);
