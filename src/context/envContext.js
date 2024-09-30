"use client";
import poolConfig from "@/lib/common/db/pool-config";
import { createContext, useState } from "react";

const EnvContext = createContext("PROD");

export function EnvContextProvider({ children }) {
  const [contEnv, setContEnv] = useState("PROD");

  return (
    <EnvContext.Provider value={{ contEnv, setContEnv }}>
      {children}
    </EnvContext.Provider>
  );
}

export default EnvContext;
