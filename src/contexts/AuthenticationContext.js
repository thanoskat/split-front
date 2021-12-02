import React, { useState } from 'react'
export const AuthenticationContext = React.createContext()

//keeps global variables to be accessible
export function AuthenticationContextProvider({ children }) {

  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [sessionID, setSessionID] = useState(localStorage.getItem('sessionID'))

  const signIn = (token, aSessionID) => {
    console.log("Auth context signIn")
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
    console.log('setSessionID', aSessionID)
    localStorage.setItem('sessionID', aSessionID)
  }

  const refreshAccessToken = (token) => {
    console.log("Auth context refreshAccessToken")
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
  }

  const signOut = () => {
    console.log("Auth context signOut")
    setAccessToken('')
    localStorage.setItem('accessToken', '')
    setSessionID('')
    localStorage.setItem('sessionID', '')
  }

  return(
    <AuthenticationContext.Provider value={
      { accessToken: accessToken,
        sessionID: sessionID,
        signIn: signIn,
        signOut: signOut,
        refreshAccessToken: refreshAccessToken
      } }>
      {children}
    </AuthenticationContext.Provider>
  )
}
