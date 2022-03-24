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


function MultiSelect({ optionsArray, setTrackIndexAndID, allowMultiSelections, label, value }) {

  const onSubmitFunction = (allowMultiSelections, option, index) => {
    if (allowMultiSelections) {
      const tracker = value.findIndex(item => item._id === option._id)
      if (tracker == -1) { //if ID is not in the array, push it
        setTrackIndexAndID(oldArr => [...oldArr, { _id: option._id, index: index }])
      } else {
        setTrackIndexAndID(value.filter(item => item._id !== option._id)) //else remove it
      }
    } else {
      const tracker = value.findIndex(item => item._id === option._id)
      if (tracker == -1) { //if ID is not in the array, push it
        setTrackIndexAndID([{ _id: option._id, index: index }])
      } else { //else remove it
        setTrackIndexAndID(value.filter(item => item._id !== option._id))
      }

    }
  }

  return (
    <div className='v-flex'>
      <div className='multiselectbox'>
        {optionsArray.map((option, index) =>
          <div className='v-flex profilecircle' key={index} onClick={() => onSubmitFunction(allowMultiSelections, option, index)} >
            <span className={value.findIndex(item => item.index === index) == -1 ? "avatar" : "avatar avatar-active"}> </span>
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

function Tags({ label }) {

  return (
    <div className='v-flex'>
      <div className='multiselectbox tags'>

          <div className='h-flex tag-section' style={{backgroundColor:"var(--pink)"}}>
            <div className='tag-section-name'>
            Tickets
            </div>
            <div className='tag-section-close'>
              <i className="times icon"></i>
            </div>
        </div>

        <div className='h-flex tag-section' style={{backgroundColor:"var(--purple)"}}>
            <div className='tag-section-name'>
            Bill
            </div>
            <div className='tag-section-close'>
              <i className="times icon"></i>
            </div>
        </div>

        <div className='h-flex tag-section'>
            <div className='tag-section-name'>
            Food
            </div>
            <div className='tag-section-close'>
              <i className="times icon"></i>
            </div>
        </div>
        <div className='h-flex tag-section' style={{backgroundColor:"var(--orange)"}}>
            <div className='tag-section-name'>
            Rent
            </div>
            <div className='tag-section-close'>
              <i className="times icon"></i>
            </div>
        </div>
       
      </div>
    </div>
  )
}

Form.Tags = Tags;
Form.InputField = InputField;
Form.DropDownField = DropDownField;
Form.MultiSelect = MultiSelect;

export default Form;
