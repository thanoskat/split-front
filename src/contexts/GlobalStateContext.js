import React, { useState } from 'react'



export const GlobalStateContext = React.createContext();
//keeps global variables to be accessible
export function GlobalStateContextProvider({ children }) {

  const [activeIndex, setActiveIndex] = useState(0);
  const[pathIndex,setPathIndex]=useState(0)

  return (
    <GlobalStateContext.Provider
      value=
      {{
        activeIndex: activeIndex,
        setActiveIndex:setActiveIndex, 
        pathIndex:pathIndex,
        setPathIndex:setPathIndex
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
}
