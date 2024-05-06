import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  // Initialize id as a string to store BigInt
  const [id, setId] = useState('');

  const verifyUser = async (username) => {
    console.log("verifying " + username);
    setUsername(username);
    const res = await fetch("/api/userVerification?username=" + username);
    const data = await res.json();
    console.log(data);
    if (data.length > 0) {
      // Assuming the ID is returned as a string from your API
      setId(BigInt(data[0].id));
      router.push(`/stake`);
    } else {
      const body = { username: username };
      const addUserRes = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const newUser = await addUserRes.json();
      // Set the ID as a string
      setId(newUser.id);
      router.push(`/deposit`);
    }
  };

  return (
    <UserContext.Provider value={{ username, id, verifyUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUserContext = () => useContext(UserContext);
