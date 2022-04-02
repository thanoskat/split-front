import { SlidingBox, ExpenseTag } from './'
import { useContext, useRef, useState, useEffect } from 'react'
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

function InputField({ value, label, maxLength, required, onChange, clear, placeholder, allowTag, expenseTags, setExpenseTags, setGroupTags }) {

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
  const handleExpenseTagsClick = (tag) => {
    setExpenseTags(expenseTags.filter(item => item.name !== tag.name))
    setGroupTags(prevTag => [...prevTag, tag])
  }

  return (
    <div className='single-input-section'>
      <input
        className='input-field'
        placeholder={placeholder}
        value={value}
        onChange={checkLengthAndChange}
        spellCheck='false'
        ref={inputFieldRef}
      />
      {value && <i className='input-clear-icon times icon' onClick={clearAndFocus} />}
      {allowTag ?
        <div className='input-tagsection gap8'>
          {expenseTags.map((tag) =>
            <ExpenseTag
              showClose={true}
              text={tag.name}
              color={tag.color}
              onCloseClick={() => handleExpenseTagsClick(tag)} />
          )}
        </div> : ""
      }
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

// function DropDownField({ utilities }) {
//   const [value, setValue] = useState(null)
//   console.log("Value rendered", value)
//   // console.log("utilities",utilities)
//   return (
//     <Dropdown
//       placeholder={"Send to"}
//       value={value}
//       setValue={setValue}
//       mapTo="nickname"
//       id="_id"
//       utilities={utilities}
//       displaynamesbox={1}
//       mouse={"mouseup"}
//     />
//   )
// }


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
    <div className='flex column'>
      <div className='multiselectbox'>
        {optionsArray.map((option, index) =>
          <div className='flex column profilecircle' key={index} onClick={() => onSubmitFunction(allowMultiSelections, option, index)} >
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

function Tags({ groupTags, setGroupTags, expenseTags, setExpenseTags, tagText, maxLength, onChange, handleKeyDown, handleBlur, newtagRef, colors }) {

  console.log(expenseTags.length + groupTags.length, colors.length)

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

  const handleGroupTagsClick = (tag) => {
    setGroupTags(groupTags.filter(item => item.name !== tag.name))
    setExpenseTags(prevTag => [...prevTag, tag])
  }

  // const handleDownTagsClick = (tag) => {
  //   setDownTags(downTags.filter(item => item.name !== tag.name))
  //   setUpTags(prevTag => [...prevTag, tag])
  // }

  return (
    <div className='Tags v-flex'>
      <div className='tags-header'>
        Select tags
      </div>
      <div className='multiselectbox tobeSelectedTags'>

        {groupTags.map((tag) =>
          <ExpenseTag
            showClose={false}
            text={tag.name}
            color={tag.color}
            onBodyClick={() => handleGroupTagsClick(tag)} />
        )}

        {expenseTags.length + groupTags.length !== colors.length ?
          <div className='h-flex tag-section newtag-section'>
            <input
              ref={newtagRef}
              className='newtag-input'
              placeholder='new tag'
              value={tagText}
              onChange={checkLengthAndChange}
              style={tagText.length ? { width: `${tagText.length + 1}ch` } : { width: `${tagText.length + 7}ch` }}
              onBlur={(e) => handleBlur(e)}
              onKeyPress={(e) => handleKeyDown(e)} />

            <i className="tag icon newtagIcon"></i>

          </div> : ""}
      </div>

      {/* <div className='multiselectbox selectedTags'>
        {downTags.length ? "" : "add tag"}
        {downTags.map((tag, index) =>
          <div className='h-flex tag-section'
            key={index}
            style={{ backgroundColor: `${tag.color}` }}>
            <div className='tag-section-name'>
              {tag.name}
            </div>
            <div className='tag-section-close'
              onClick={() => handleDownTagsClick(tag)}>
              <i className="times icon"></i>
            </div>
          </div>
        )}
      </div> */}
    </div>
  )
}

Form.Tags = Tags;
Form.InputField = InputField;
//Form.DropDownField = DropDownField;
Form.MultiSelect = MultiSelect;

export default Form;
