import { createContext, useContext, useState } from "react";

// Create a context
const UserContext = createContext();

// Provider component to wrap your application
const UserProvider = ({ children }) => {
  // Define the state or functions you want to provide
  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
const useUserContext = () => {
  return useContext(UserContext);
};

export { UserProvider, useUserContext };
