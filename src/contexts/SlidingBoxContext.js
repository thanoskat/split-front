import { useState, createContext } from 'react'
export const SlidingBoxContext = createContext()

//keeps global variables to be accessible
export function SlidingBoxContextProvider({ children }) {

  const [animation, setAnimation] = useState('in')

  const closeBox = () => {
    setAnimation('out')
  }

  return(
    <SlidingBoxContext.Provider
      value=
        {{
          closeBox: closeBox,
          animation: animation,
          setAnimation: setAnimation
        }}>
      {children}
    </SlidingBoxContext.Provider>
  )
}
