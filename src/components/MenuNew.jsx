import { SlidingBox } from './'
import { useDispatch } from 'react-redux'
import { setCurrentMenu } from '../redux/mainSlice'

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
