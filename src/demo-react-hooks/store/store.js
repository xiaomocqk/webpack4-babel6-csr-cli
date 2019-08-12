import React, { createContext, useState } from 'react';

export const GlobalContext = createContext({});

export function GlobalProvider(props) {
  const [appName, setAppName] = useState('initial appName');

  return (
    <GlobalContext.Provider
      value={{
        appName,
        setAppName
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}