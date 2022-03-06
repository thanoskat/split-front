import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/FormBox.css"

function FormBox({ headline, submit, close, children }) {

  const [isAnimationOut, setIsAnimationOut] = useState(false)

  const checkIfOutAndClose = (e) => {
    if(e.animationName == 'outAnimationFormBox'){
      close()
    }
  }

  return (
    <div onAnimationEnd={checkIfOutAndClose}>
      <div onClick={() => setIsAnimationOut(true)} className='form-box-gray-box'/>
      <div className={'form-box'} style={{animation: `${isAnimationOut ? 'out' : 'in'}AnimationFormBox 100ms linear`}}>
        {headline && <div className='form-box-headline'>{headline}</div>}
        <div className='inputs-section'>
          {children}
        </div>
        <div className='input-button' onClick={submit}>OK</div>
      </div>
    </div>
  );
}

function InputField({ value, label, maxLength, required, onChange }) {

  const checkLengthAndChange = (e) => {
    if(maxLength) {
      if(e.target.value.length <= maxLength) {
        return onChange(e)
      }
    }
    else {
      return onChange(e)
    }
  }

  return (
    <div className='single-input-section'>
      <input
        className='input-field'
        value={value}
        onChange={checkLengthAndChange}
        spellCheck="false"
      />
      <div className='input-label-section'>
        <div className='input-label'>{label}</div>
        {maxLength &&
          <div
            className='input-right-label'
            style={required && value.length == 0 ? {color:'red'} : {}}
          >
            {`${value.length}/${maxLength}`}
          </div>
        }
      </div>
    </div>
  )
}

FormBox.InputField = InputField;
export default FormBox;
