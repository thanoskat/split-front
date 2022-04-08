import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'menu',
  initialState: {
    currentMenu: 'none',
    groupList: [],
    selectedGroup: null,
    groupTags: [], //new
    activeIndex: 0 //new
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
    setActiveIndex: (state, action) => { //new
      state.activeIndex = action.payload
    }
  }
})

export const { setCurrentMenu, setGroupList, setSelectedGroup, setActiveIndex } = mainSlice.actions

export default mainSlice.reducer
