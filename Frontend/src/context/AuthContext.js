import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userid, setuserid] = useState(null);
  const [username,setusername]=useState("User");
  return (
    <AuthContext.Provider value={{ userid, setuserid,username,setusername}}>
      {children}
    </AuthContext.Provider>
  );
};