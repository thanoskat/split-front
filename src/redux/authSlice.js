import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken'),
    sessionData: {
      id: localStorage.getItem('sessionId'),
      userEmail: localStorage.getItem('userEmail'),
      userId: localStorage.getItem('userId'),
      userNickname: localStorage.getItem('userNickname')
    },
  },
  reducers: {
    refreshAccessToken: (state, action) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    signIn: (state, action) => {
      state.accessToken = action.payload.accessToken
      localStorage.setItem('accessToken', action.payload.accessToken)
      state.sessionData = action.payload.sessionData
      localStorage.setItem('sessionId', action.payload.sessionData.id)
      localStorage.setItem('userId', action.payload.sessionData.userId)
      localStorage.setItem('userEmail', action.payload.sessionData.userEmail)
      localStorage.setItem('userNickname', action.payload.sessionData.userNickname)
    },
    signOut: (state) => {
      state.accessToken = ''
      localStorage.setItem('accessToken', '')
      state.sessionData = ''
      localStorage.setItem('sessionId', '')
      localStorage.setItem('userEmail', '')
      localStorage.setItem('userId', '')
      localStorage.setItem('userNickname', '')
    },
  }
})

export const { refreshAccessToken, signIn, signOut } = authSlice.actions

export default authSlice.reducer
