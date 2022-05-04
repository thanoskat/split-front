import { useDispatch, useSelector } from 'react-redux'
import { openSlidingLeftBox, closeSlidingLeftBox } from '../redux/slidingLeftSlice'
import "../style/SlidingLeftBox.css"

function SlidingLeftBox({ close, children, className, style }) {

  // const { animation, setAnimation, closeBox } = useContext(SlidingBoxContext)
  const animation = useSelector(state => state.slidingLeftReducer.animation)
  const dispatch = useDispatch()

  const checkIfOutAndClose = (e) => {
    if(e.animationName === 'outLeftAnimationSlidingBox'){
      close()
      dispatch(openSlidingLeftBox())
    }
  }

  return (
    <div onAnimationEnd={checkIfOutAndClose}>
      <div onClick={() => dispatch(closeSlidingLeftBox())} className='out-area'/>
      {/* <div className={'sliding-box'} style={{animation: `${animation}AnimationSlidingBox 80ms linear`}}> */}
      <div className={`sliding-box ${className}`} style={{animation: `${animation}AnimationSlidingBox 100ms linear`, ...style}}>
        {children}
      </div>
    </div>
  );
}

export default SlidingLeftBox;
