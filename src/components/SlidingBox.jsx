import { useState, useContext } from 'react'
import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
import "../style/SlidingBox.css"

function SlidingBox({ close, children }) {

  const { animation, setAnimation, closeBox } = useContext(SlidingBoxContext)

  const checkIfOutAndClose = (e) => {
    if(e.animationName == 'outAnimationSlidingBox'){
      close()
      setAnimation('in')
    }
  }

  return (
    <div onAnimationEnd={checkIfOutAndClose}>
      <div onClick={closeBox} className='out-area'/>
      <div className={'sliding-box'} style={{animation: `${animation}AnimationSlidingBox 80ms linear`}}>
        {children}
      </div>
    </div>
  );
}

export default SlidingBox;
