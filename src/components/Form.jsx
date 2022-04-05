import { SlidingBox, Tag } from './'
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

function InputField({ value, label, maxLength,
  required, onChange, clear,
  placeholder, allowExpenseTags, allowMembersTags, expenseTags,
  setExpenseTags, setGroupTags,
  splitAmongMembers, setSplitAmongMembers }) {

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

  const handleMembersTagsClick = (tag) => {

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

      {allowExpenseTags ?
        <div className='input-tagsection gap8'>

          {expenseTags.map((tag) =>
            <Tag
              showClose={true}
              text={tag.name}
              color={tag.color}
              onCloseClick={() => handleExpenseTagsClick(tag)} />
          )}
        </div> : ""
      }
      {allowMembersTags ?
        <div className='input-tagsection gap8'>
          {splitAmongMembers.map((tag) =>
            <Tag
              showClose={true}
              text={tag.nickname}
              color="var(--inactiveColor)"
              onCloseClick={() => handleMembersTagsClick(tag)} />
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

function MembersTags({ optionsArray, allowMultiSelections }) {

  const handleMembersClick = (option) => {

  }

  return (
    <div className='split v-flex'>
      <div className='multiselectbox tobeSelectedTags'>
        {optionsArray.map(option =>
          <Tag
            onBodyClick={() => handleMembersClick(option)}
            showClose={false}
            text={option.nickname}
            color="var(--inactiveColor)"
          />)}

      </div>

      <div className='splitamongAllChecker h-flex'>
        <div className='checkBox'>
          <input type="checkbox" />
        </div>
        <div className='checkBox-text '>
          split among all members
        </div>
      </div>

    </div>
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
  // value.findIndex(item => item.index === index) == -1
  return (
    <div className='flex column'>
      <div className='multiselect-description'>
        {label}
      </div>
      <div className='multiselectbox'>

        {optionsArray.map((option, index) =>
          <div className='flex column profilecircle' key={index} onClick={() => onSubmitFunction(allowMultiSelections, option, index)} >

            <span className='avatar'>
              <div className='firstLetter'>
              {option.nickname.charAt(0)}
              </div>
            {value.findIndex(item => item.index === index) == -1? "":
             <div className='circleOfCircle'>
             <div className='tick-circle'>
               <i className='check icon avatarcheck'></i>
             </div>
           </div>
           }
             
            </span>
            <div className='avatar-description'>{option.nickname}</div>

          </div>

        )}

        <div className='flex column profilecircle'>
          <span className='avatar'>
            <div className='firstLetter'>
              AB
            </div>

            <div className='circleOfCircle'>
              <div className='tick-circle'>
                <i className='check icon avatarcheck'></i>
              </div>
            </div>

          </span>
          <div className='avatar-description'>hello</div>
        </div>
        

      </div>
    </div>
  )
}



function ExpenseTags({ groupTags, setGroupTags, expenseTags, setExpenseTags, tagText, maxLength, onChange, handleKeyDown, handleBlur, newtagRef, colors }) {

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
          <Tag
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

Form.MembersTags = MembersTags;
Form.ExpenseTags = ExpenseTags;
Form.InputField = InputField;
//Form.DropDownField = DropDownField;
Form.MultiSelect = MultiSelect;

export default Form;
