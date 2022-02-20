import React, { useEffect, useState } from 'react'
import useAxios from '../utility/useAxios';


export const GlobalStateContext = React.createContext();
//keeps global variables to be accessible
export function GlobalStateContextProvider({ children }) {

  const [activeIndex, setActiveIndex] = useState(0);
  const [belongtoGroups, setBelongtoGroups] = useState([])

  const api = useAxios()
 

  useEffect(async () => {
    try {
      const response = await api.get('/groups/mygroups')
      setBelongtoGroups(response.data)
      console.log("RAN",response.data)
    } catch (err) {
      console.dir("globalStateErr ", err)
    }
  },[])

  return (
    <GlobalStateContext.Provider
      value=
      {{
        activeIndex: activeIndex,
        setActiveIndex:setActiveIndex,
        belongtoGroups:belongtoGroups,
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
}
