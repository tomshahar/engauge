import React, { createContext, useContext, useState } from 'react'

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {}
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

const useLoading = () => useContext(LoadingContext)
export default useLoading