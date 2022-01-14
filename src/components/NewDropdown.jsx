import React from 'react'
import '../style/NewDropdown.css'
import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'



export default function NewDropdown({ options, prompt, value, setValue, id, label }) {

    //chris@gmail.com
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const ref = useRef(null)


    function filter(options) {
        return options.filter(option =>
            option[label].toLowerCase().indexOf(query.toLowerCase()) > -1)
    }

    function displayValue() {
        if (query.length > 0) return query;
        if (value) return value[label];
        return "";
    }

    useEffect(() => {
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close)
    }, [])

    const close = (e) => {
        setOpen(e && e.target === ref.current)

    }
    return (
        <div className='dropdown'>
            <div className="control" onClick={() => setOpen(prev => !prev)}>
                <div className="selected-value" >
                    <input type="text"
                        ref={ref}
                        value={displayValue()}
                        placeholder={value ? value[label] : prompt}
                        onChange={e => {
                            setQuery(e.target.value)
                            setValue(null)
                        }}
                        onClick={()=>setOpen(prev=>!prev)}
                    />
                </div>
                <div className={`arrow ${open ? "open" : null}`}></div>
            </div>
            <div className={`options ${open ? "open" : null}`}>
                {
                    filter(options).map(option =>
                        <div key={option[id]} className={`option ${value === option ? "selected" : null
                            }`}
                            onClick={() => {
                                setQuery("")
                                setValue(option)
                                setOpen(false)
                            }}
                        >{option[label]}</div>
                    )
                }

            </div>
        </div>
    )
}
