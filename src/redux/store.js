import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import slidingReducer from './slidingSlice'
import slidingLeftReducer from './slidingLeftSlice'
import mainReducer from './mainSlice'

export default configureStore({
  reducer: {
    authReducer,
    slidingReducer,
    slidingLeftReducer,
    mainReducer,
  },
  devTools: true,
})
