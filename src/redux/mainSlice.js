import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'menu',
  initialState: {
    currentMenu: 'none',
    groupList: [],
    selectedGroup: null,
    groupTags: [], //new
    activeIndex: 0, //new,
    isLoading: false,
    clickedIndex: null
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
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload
    },
    setLoading: (state, action) => {
      state.activeIndex = action.payload
    },
    setClickedIndex: (state, action) => {
      state.activeIndex = action.payload
    }
  }
})

export const { setCurrentMenu, setGroupList, setSelectedGroup, setActiveIndex,setLoading,setClickedIndex } = mainSlice.actions

export default mainSlice.reducer
