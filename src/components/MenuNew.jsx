import { useState, useEffect, useRef, useContext } from 'react'
import { SlidingBox } from './'
// import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import { setCurrentMenu } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'

const MenuNew = ({ close }) => {
  const dispatch = useDispatch()

  return (
    <SlidingBox close={close} className='group-selector top-radius'>
      {/* <div className='flex row t05 justcont-center alignitems-center padding4'>New</div> */}
      {/* <div className='separator-0'/> */}
      <div className='flex column gap4 padding4'>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(setCurrentMenu('groupSelector'))}>
          <div>Expense</div>
        </div>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(setCurrentMenu('new'))}>
          <div>Member</div>
        </div>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(setCurrentMenu('groupSelector'))}>
          <div>Transfer</div>
        </div>
      </div>
    </SlidingBox>
  )
}

export default MenuNew
