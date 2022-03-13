import React from 'react'
import '../style/Dropdown.css'
import { useState, useRef, useEffect } from 'react'


export default function Dropdown({ placeholder, options, mouse, setValue, mapTo, id, utilities, displaynamesbox }) {

  // onChange={val=>setValue(val)}

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [dummyState, setDummyState] = useState(false)
  const [item, setItem] = useState(false)
  
  const ref = useRef(null)

  options = utilities.tobeRemovedOption
  console.log(utilities.tobeRemovedOption)
  console.log(options)

  useEffect(() => {
    // Add a listener for mouse click
    document.addEventListener(mouse, close);
    // Remove listener when done with it
    return (() => { document.removeEventListener(mouse, close) })
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
      <div className={`options ${open && utilities.tobeRemovedOption.length !== 0 ? 'open' : null}`}>
        {
          filter(options).map((option, index) =>
            <div
              key={option[id]}
              // className={`option ${value === option ? "selected" : null}`}
              className={`option `}
              onClick={() => {
                setQuery("")
                setValue(option)
                setOpen(false)
                utilities.tobeRetrievedOption.push(option)
                utilities.tobeRemovedOption.splice(index, 1);
                console.log("tobeRemovedOption", utilities.tobeRemovedOption)
                console.log("tobeRetrievedOption", utilities.tobeRetrievedOption)
                setItem(true)
              }}>
              {option[mapTo]}
            </div>
          )
        }
      </div>
      {displaynamesbox ?

        <div className={`nickname-box ${item ? 'item' : null}`}>
          {item ? <span className='nickname-box invite-friends'>Send invitation to:</span> : <></>}
          {
            utilities.tobeRetrievedOption.map((u, indx) =>
              <div key={u.email} className='nickname-box nickname-section'>
                <div className="nickname-box nickname-exit-button" key={indx} onClick={
                  () => {
                    utilities.tobeRemovedOption.push(u)
                    utilities.tobeRemovedOption.sort((a, b) => a.nickname.localeCompare(b.nickname))
                    utilities.tobeRetrievedOption.splice(indx, 1);
                    // console.log("tobeRemovedOption after ", utilities.tobeRemovedOption)
                    // console.log("tobeRetrievedOption after", utilities.tobeRetrievedOption)
                    setDummyState(prev => !prev)
                    if (utilities.tobeRetrievedOption.length == 0) {
                      setItem(false)
                    }
                  }}>
                  <i className="times icon x"></i>
                </div>
                <div className="nickname-box nickname-name">
                  {u[mapTo]}
                </div>

              </div>
            )}
        </div>
        : <></>
      }
    </div>
  )
}
