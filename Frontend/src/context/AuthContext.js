import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userid, setuserid] = useState(null);

  return (
    <AuthContext.Provider value={{ userid, setuserid}}>
      {children}
    </AuthContext.Provider>
  );
};