import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/Input.css"

function FormInputField({ value, label, maxLength, required, onChange }) {

  return (
    <div className='single-input-section'>
      <input
        className='input-field'
        value={value}
        onChange={onChange}
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
