import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import slidingReducer from './slidingSlice'
import mainReducer from './mainSlice'

export default configureStore({
  reducer: {
    authReducer,
    slidingReducer,
    mainReducer,
  },
  devTools: true,
})
