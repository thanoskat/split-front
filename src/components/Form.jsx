import { SlidingBox } from './'
import { useContext, useRef, useState } from 'react'
import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
import { Dropdown } from "."
import "../style/Form.css"

function Form({ headline, submit, close, children }) {

  const { closeBox } = useContext(SlidingBoxContext)

  const submitAndClose = () => {
    submit()
    closeBox()
  }

  return (
    <SlidingBox close={close} >
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
    if (maxLength) {
      if (e.target.value.length <= maxLength) {
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
      {value && <i className='input-clear-icon times icon' onClick={clearAndFocus} />}
      <div className='input-label-section'>
        <div className='input-label'>{label}</div>
        {maxLength &&
          <div
            className='input-right-label'
            style={required && value.length == 0 ? { color: 'red' } : {}}
          >
            {`${value.length}/${maxLength}`}
          </div>
        }
      </div>
    </div>
  )
}

function DropDownField({ utilities }) {
  const [value, setValue] = useState(null)
  console.log("Value rendered", value)
  // console.log("utilities",utilities)
  return (
    <Dropdown
      placeholder={"Send to"}
      value={value}
      setValue={setValue}
      mapTo="nickname"
      id="_id"
      utilities={utilities}
      displaynamesbox={1}
      mouse={"mouseup"}
    />
  )
}


function MultiSelect({ optionsArray, setKeepID, allowMultiSelections, label, value }) {

  const onSubmitFunction = (allowMultiSelections, option) => {
    if (allowMultiSelections) {
      if (!value.includes(option._id)) {
        setKeepID(oldArr => [...oldArr, option._id])
      } else {
       //something to remove item from State
      }
    } else {
      setKeepID(option._id)
    }
  }

  return (
    <div className='v-flex'>
      <div className='multiselectbox'>
        {optionsArray.map((option) =>
          <div className='v-flex profilecircle' onClick={() => onSubmitFunction(allowMultiSelections, option)} >
            <span className='avatar'></span>
            <div className='avatar-description'>{option.nickname}</div>
          </div>
        )}
      </div>
      <div className='multiselect-description'>
        {label}
      </div>
    </div>
  )
}

Form.InputField = InputField;
Form.DropDownField = DropDownField;
Form.MultiSelect = MultiSelect;

export default Form;
