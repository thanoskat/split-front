import { useState, useEffect, useRef, useContext } from 'react'
import { SlidingBox } from './'
// import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import { setCurrentMenu, setSelectedExpense } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'

const MenuExpenseOptions = ({ close }) => {
  const dispatch = useDispatch()
  const selectedExpense = store.getState().mainReducer.selectedExpense

  const deleteExpense = () => {
    console.log(`${selectedExpense.description} deleted!`)
    dispatch(closeSlidingBox())
  }

  const removeSelectedExpenseAndClose = () => {
    dispatch(setSelectedExpense(null))
    close()
  }

  return (
    <SlidingBox close={removeSelectedExpenseAndClose} className='group-selector top-radius'>
      <div className='flex row t05 justcont-center alignitems-center padding4'>{`Delete ${selectedExpense.description}?`}</div>
      {/* <div className='separator-0'/> */}
      <div className='flex column gap4 padding4'>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={deleteExpense}>
          <div>Yes</div>
        </div>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(closeSlidingBox())}>
          <div>No</div>
        </div>
      </div>
    </SlidingBox>
  )
}

export default MenuExpenseOptions
