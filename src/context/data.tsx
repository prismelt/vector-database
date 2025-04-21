import { useState, createContext, useContext, ReactNode } from "react";

interface childrenType {
  children: ReactNode;
}

interface dataType {
  data: string[]; // Changed from string to string[]
  setData: (data: string[]) => void; // Changed parameter type
}

const DataContext = createContext<dataType | undefined>(undefined);

function useDataContext() {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error("Invalid Data Context Undefined.");
  }
  return context;
}

function DataProvider({ children }: childrenType) {
  const [data, setData] = useState<string[]>([]); // Initialize as empty array

  const value: dataType = { data, setData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default useDataContext;
export { DataProvider };
