import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/Select.css"

function SelectBox({ headline, rightHeadline, close, children }) {
  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={close} className='select-gray-box'/>
      <div className={'select'}>
        <div className='select-headline-section'>
          <div className='select-headline'>{headline}</div>
          {rightHeadline && <div className='select-right-headline'>{rightHeadline}</div>}
        </div>
        <div className='select-button-section'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default SelectBox;
