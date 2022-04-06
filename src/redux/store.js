import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import slidingReducer from './slidingSlice'

export default configureStore({
  reducer: {
    authReducer,
    slidingReducer,
  },
  devTools: true,
})
