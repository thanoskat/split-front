import React from 'react'
import '../style/Dropdown.css'
import { useState, useRef, useEffect } from 'react'


export default function Dropdown({ placeholder, options, value, setValue, mapTo, id, utilities }) {

  // onChange={val=>setValue(val)}

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [dummyState, setDummyState]=useState(false)

  const ref = useRef(null)

  useEffect(() => {
    // Add a listener for mouse click
    document.addEventListener("mouseup", close);
    // Remove listener when done with it
    return (() => { document.removeEventListener("mouseup", close) })
  }, [ref]);

  function close(event) {
    setOpen(event && ref.current === event.target)
  }

  function filter(options) {
    return options.filter(option =>
      option[mapTo]?.toLowerCase().indexOf(query?.toLowerCase()) > -1)
  }

  function displayValue() {
    if (query.length > 0) return query;
    // if (value) return value[mapTo]; //not required as we don't want to show name on search bar after click
    return "";
  }

  return (
    <div className='dropdown' >
      <div className="control"
        onClick={() => setOpen(prev => !prev)}>
        <div className="Add-Friend-Section"  >
          <input required type="text" className="Add-Input-Field"
            ref={ref}
            value={displayValue()}
            onChange={e => {
              setQuery(e.target.value)
              setValue(null)
            }
            }
            onClick={() => setOpen(prev => !prev)}
          />
          <span className='floating-label' >{placeholder}</span>
        </div>
      </div>
      <div className={`options ${open ? 'open' : null}`}>
        {
          filter(options).map((option, index) =>
            <div
              key={option[id]}
              className={`option ${value === option ? "selected" : null}`}
              onClick={() => {

                setQuery("")
                setValue(option)
                setOpen(false)
                utilities.tobeRetrievedOption.push(option)
                utilities.tobeRemovedOption.splice(index, 1);
                console.log("tobeRemovedOption", utilities.tobeRemovedOption)
                console.log("tobeRetrievedOption", utilities.tobeRetrievedOption)
              }}>
              {option[mapTo]}
            </div>
          )
        }
      </div>
      <div>
        {
          utilities.tobeRetrievedOption.map((u, indx) =>
            <div key={u._id} className='name'>
              <div key={u._id} onClick={
                () => {
                  utilities.tobeRemovedOption.push(u)
                  utilities.tobeRetrievedOption.splice(indx, 1);
                  console.log("tobeRemovedOption after ", utilities.tobeRemovedOption)
                  console.log("tobeRetrievedOption after", utilities.tobeRetrievedOption)
                  setDummyState(prev=>!prev)
                  
                }}>
                x
              </div>
              {u[mapTo]}
            </div>
          )}
      </div>
    </div>
  )
}
