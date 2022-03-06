import { useState } from 'react'
import "../style/SlidingBox.css"

function SlidingBox({ close, children }) {

  const [isAnimationOut, setIsAnimationOut] = useState(false)

  const checkIfOutAndClose = (e) => {
    if(e.animationName == 'outAnimationSlidingBox'){
      close()
    }
  }

  return (
    <div onAnimationEnd={checkIfOutAndClose}>
      <div onClick={() => setIsAnimationOut(true)} className='out-area'/>
      <div className={'sliding-box'} style={{animation: `${isAnimationOut ? 'out' : 'in'}AnimationSlidingBox 100ms linear`}}>
        {children}
      </div>
    </div>
  );
}

export default SlidingBox;
