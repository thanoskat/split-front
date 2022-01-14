import React from 'react'
import '../style/Dropdown.css'
import { useState, useRef, useEffect } from 'react'


export default function Dropdown({ placeholder,options, value, setValue, labelToMap, id }) {
  
  // onChange={val=>setValue(val)}
  
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      //  console.dir([ref.current,event.target])
      // If click event is outside of references
      if (ref.current && !ref.current.contains(event.target)) {
        // Dropdown display none
        setOpen(false)
      }else{
        setOpen(true)
      }
    }
    // Add a listener for mouse click
    document.addEventListener("mousedown", handleClickOutside);
    // Remove listener when done with it
    return (() => { document.removeEventListener("mousedown", handleClickOutside) })
  }, [ref]);


  function filter(options) {
    return options.filter(option =>
      option[labelToMap]?.toLowerCase().indexOf(query?.toLowerCase()) > -1)
  }

  function displayValue() {
    if (query.length > 0) return query;
    if (value) return value;
    return "";
  }

  const showValue=()=>{
    console.log(value[labelToMap])
  }

  return (
    <div className='dropdown' >
      <div className="control"
        onClick={() => setOpen(prev => !prev)}>
        <div className="Add-Friend-Section"  >
          <input required type="text" className="Add-Input-Field"
            ref={ref}
            value={displayValue()}
            onChange={
              e => {
                setQuery(e.target.value)
                setValue(null)        
              }
            }
            onClick={() => setOpen(prev => !prev)} 
          />
          <span className='floating-label' >{value? value[labelToMap]:placeholder}</span>
        </div>
      </div>
      <div className={`options ${open ? "open" : null}`}>
        {filter(options).map(option => (<div
          key={option[id]}
          className={`option ${value === option ? "selected" : null}`}
          onClick={() => {
            setQuery("");
            setValue(option);
            setOpen(false);
          }}
        >
          {option[labelToMap]}
        </div>)
        )
        }
      </div>
    </div>
  )
}
