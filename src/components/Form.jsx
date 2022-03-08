import { SlidingBox } from './'
import { useContext, useRef } from 'react'
import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
import "../style/Form.css"

function Form({ headline, submit, close, children }) {

  const { closeBox } = useContext(SlidingBoxContext)

  const submitAndClose = () => {
    submit()
    closeBox()
  }

  return (
    <SlidingBox close={close}>
      {headline && <div className='form-headline'>{headline}</div>}
      <div className='input-field-section'>
        {children}
      </div>
      <div className='submit-button' onClick={submitAndClose}>OK</div>
    </SlidingBox>
  );
}

function InputField({ value, label, maxLength, required, onChange, clear }) {

  const inputFieldRef = useRef(null)

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

  const clearAndFocus = () => {
    clear()
    inputFieldRef.current.focus()
  }

  return (
    <div className='single-input-section'>
      <input
        className='input-field'
        value={value}
        onChange={checkLengthAndChange}
        spellCheck='false'
        ref={inputFieldRef}
      />
      {value && <i className='input-clear-icon times icon' onClick={clearAndFocus}/>}
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

Form.InputField = InputField;
export default Form;
