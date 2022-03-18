import React, { useState } from 'react'
export const AuthenticationContext = React.createContext()

//keeps global variables to be accessible
export function AuthenticationContextProvider({ children }) {

  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [sessionData, setSessionData] = useState({
    id: localStorage.getItem('sessionId'),
    userEmail: localStorage.getItem('userEmail'),
    userId: localStorage.getItem('userId'),
    userNickname: localStorage.getItem('userNickname')
  })

  const signIn = (token, sessionData) => {
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
    setSessionData(sessionData)
    localStorage.setItem('sessionId', sessionData.id)
    localStorage.setItem('userId', sessionData.userId)
    localStorage.setItem('userEmail', sessionData.userEmail)
    localStorage.setItem('userNickname', sessionData.userNickname)
  }

  const refreshAccessToken = (token) => {
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
  }

  const signOut = () => {
    setAccessToken('')
    localStorage.setItem('accessToken', '')
    setSessionData('')
    localStorage.setItem('sessionId', '')
    localStorage.setItem('userEmail', '')
    localStorage.setItem('userId', '')
    localStorage.setItem('userNickname', '')
  }

  return(
    <AuthenticationContext.Provider
      value=
      {{
        accessToken: accessToken,
        signIn: signIn,
        signOut: signOut,
        refreshAccessToken: refreshAccessToken,
        sessionData: sessionData,
        setSessionData: setSessionData,
      }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
