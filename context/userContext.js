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
      const body = {
        username: username,
        amount: 0,
      };
      await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.push(`/deposit`);
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