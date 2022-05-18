import { createSlice } from '@reduxjs/toolkit'

export const slidingLeftSlice = createSlice({
  name: 'slidingLeft',
  initialState: {
    animation: 'inLeft',
  },
  reducers: {
    openSlidingLeftBox: (state) => {
      state.animation = 'inLeft'
    },
    closeSlidingLeftBox: (state) => {
      state.animation = 'outLeft'
    },
  }
})

export const { openSlidingLeftBox, closeSlidingLeftBox } = slidingLeftSlice.actions

export default slidingLeftSlice.reducer
