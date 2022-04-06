import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'menu',
  initialState: {
    currentMenu: 'none',
    groupList: [],
    selectedGroup: null
  },
  reducers: {
    setCurrentMenu: (state, action) => {
      state.currentMenu = action.payload
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload
    },
  }
})

export const { setCurrentMenu, setGroupList, setSelectedGroup } = mainSlice.actions

export default mainSlice.reducer
