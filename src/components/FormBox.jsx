import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/Input.css"

function FormBox({ headline, submit, close, children }) {

  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={close} className='input-gray-box'/>
      <div className={'input'}>
        {headline && <div className='input-headline'>{headline}</div>}
        <div className='inputs-section'>
          {children}
        </div>
        <div className='input-button' onClick={submit}>OK</div>
      </div>
    </div>
  );
}

export default FormBox;
