import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

// Create the context
const UserContext = createContext();



// Provider component
export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  
  const verifyUser = async (username) => {
    console.log("verifying "+username);
    setUsername(username);
    const res = await fetch("/api/userVerification?username=" + username);
    const data = await res.json();
    if (data.length > 0) {
      router.push(`/deposit`);
    } else {
      alert("User not found");
    }
  };

  return (
    <UserContext.Provider value={{ username, verifyUser }}>
      {children}
    </UserContext.Provider>
  );
};
// Create a custom hook to use the context
export const useUserContext = () => useContext(UserContext);