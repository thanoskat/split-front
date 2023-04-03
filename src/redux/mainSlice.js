import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
  name: 'menu',
  initialState: {
    currentMenu: 'none',
    groupList: [],
    selectedGroup: null,
    transfers: [],
    toggle: true,
    pendingTransactions: [],
    trackExpenseIDfromBreakdown: ""
  },

  reducers: {
    setCurrentMenu: (state, action) => {
      state.currentMenu = action.payload
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload
    },
    setToggle: (state, action) => {
      state.toggle = action.payload
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload
    },
    setTransfers: (state, action) => {
      state.transfers = action.payload
    },
    setPendingTransactions: (state, action) => {
      state.pendingTransactions = action.payload
    },
    setTrackID: (state, action) => {
      state.trackExpenseIDfromBreakdown = action.payload
    }
  }
})

export const { setCurrentMenu, setGroupList, setSelectedGroup, setPendingTransactions, setTrackID, setTransfers, setToggle } = mainSlice.actions
export default mainSlice.reducer
