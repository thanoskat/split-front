import { createSlice } from '@reduxjs/toolkit'

export const slidingSlice = createSlice({
  name: 'sliding',
  initialState: {
    animation: 'in',
  },
  reducers: {
    openSlidingBox: (state) => {
      state.animation ='in'
    },
    closeSlidingBox: (state) => {
      state.animation ='out'
    },
  }
})

export const { openSlidingBox, closeSlidingBox } = slidingSlice.actions

export default slidingSlice.reducer
