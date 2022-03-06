import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/Input.css"

function FormInputField({ value, label, maxLength, required, onChange }) {

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

export default FormInputField;
