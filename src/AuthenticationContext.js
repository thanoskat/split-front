import React, { useState } from 'react'
export const AuthenticationContext = React.createContext()

//keeps global variables to be accessible
export function AuthenticationContextProvider({ children }) {

  const [accessToken, setAccessToken] = useState(window.localStorage.getItem('accessToken'))

  const signIn = (token, sessionID) => {
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
    localStorage.setItem('sessionID', sessionID)
  }

  const refreshAccessToken = (token) => {
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
  }

  const signOut = () => {
    setAccessToken('')
    localStorage.setItem('accessToken', '')
    localStorage.setItem('sessionID', '')
  }

  return(
    <AuthenticationContext.Provider value={
      { accessToken: accessToken,
        signIn: signIn,
        signOut: signOut,
        refreshAccessToken: refreshAccessToken
      } }>
      {children}
    </AuthenticationContext.Provider>
  )
}
