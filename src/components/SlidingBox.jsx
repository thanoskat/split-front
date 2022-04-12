import { useContext } from 'react'
// import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { openSlidingBox, closeSlidingBox } from '../redux/slidingSlice'
import "../style/SlidingBox.css"

function SlidingBox({ close, children, className }) {

  // const { animation, setAnimation, closeBox } = useContext(SlidingBoxContext)
  const animation = useSelector(state => state.slidingReducer.animation)
  const dispatch = useDispatch()

  const checkIfOutAndClose = (e) => {
    if(e.animationName === 'outAnimationSlidingBox'){
      close()
      // setAnimation('in')
      dispatch(openSlidingBox())
    }
  }

  return (
    <div onAnimationEnd={checkIfOutAndClose}>
      <div onClick={() => dispatch(closeSlidingBox())} className='out-area'/>
      {/* <div className={'sliding-box'} style={{animation: `${animation}AnimationSlidingBox 80ms linear`}}> */}
      <div className={`sliding-box ${className}`} style={{animation: `${animation}AnimationSlidingBox 100ms linear`}}>
        {children}
      </div>
    </div>
  );
}

export default SlidingBox;
