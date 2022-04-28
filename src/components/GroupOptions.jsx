import { SlidingBox } from './'
import { useDispatch } from 'react-redux'
import { setCurrentMenu } from '../redux/mainSlice'

const GroupOptions = ({ close }) => {
  const dispatch = useDispatch()

  return (
    <SlidingBox close={close} className='group-selector top-radius'>
      <div className='flex column gap4 padding4'>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(setCurrentMenu('editTags'))}>
          <div>Edit group tags</div>
        </div>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(setCurrentMenu('new'))}>
          <div>Leave group</div>
        </div>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(setCurrentMenu('new'))}>
          <div>Delete group</div>
        </div>
      </div>
    </SlidingBox>
  )
}

export default GroupOptions
