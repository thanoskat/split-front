import { SlidingBox, Tag } from './'
import { useRef, useState, useEffect, useContext } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import "../style/Form.css"
import { GlobalStateContext } from '../contexts/GlobalStateContext'

function Form({ headline, submit, close, groupList, activeIndex }) {
  const api = useAxios()
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const [trackIndexAndIDmulti, setTrackIndexAndIDmulti] = useState([])
  const [inputDescription, setInputDescription] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [expenseTags, setExpenseTags] = useState([])
  const [tagText, setTagText] = useState("");

  //const [groupInfo, setGroupInfo] = useState([]);
  //const { activeIndex, setActiveIndex } = useContext(GlobalStateContext)//
  //const [members, setMembers] = useState([])//
  const [splitAmongMembersCheck, setSplitAmongMembersCheck] = useState(true)
  const [showGroupTags, setShowGroupTags] = useState([])
  //const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)

  const tagTextRef = useRef(tagText)
  const newtagRef = useRef(null)
  const dispatch = useDispatch()
  console.log(selectedGroup)

  useEffect(() => {
    fetchData()
  }, [])

 
  const fetchData = async () => {
    function getDifference(array1, array2) {
      return array1.filter(object1 => { //(filter keeps whatever the function inside it tell it to keep)
        return !array2.some(object2 => {
          return object1._id === object2._id;
        });
      });
    }
    const difference = [...getDifference(selectedGroup.groupTags, expenseTags), ...getDifference(expenseTags, selectedGroup.groupTags)]
    setShowGroupTags(difference)
    if (splitAmongMembersCheck) { setTrackIndexAndIDmulti(selectedGroup.members.filter(filterIDfromMembers).map((option, index) => ({ _id: option._id, index: index }))) }
  }

  const colors = [
    "var(--yellow)",
    "var(--pink)",
    "var(--purple)",
    "var(--orange)",
    "var(--green)",
    "var(--lightblue)",
    "var(--lightorange)",
    "var(--color1)",
    "var(--color2)",
    "var(--color3)"]

  const onChangeTagName = (e) => {
    //capitalises first and lowercases rest
    const capitalFirstLowerCaseRest = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase()
    tagTextRef.current = capitalFirstLowerCaseRest //listener only has access to the initial state, so it will always log "" (as initialised)
    setTagText(capitalFirstLowerCaseRest)       //This is because listener belongs to the initial render and is not updated on subsequent rerenders.
  }

  const handleKeyDown = async (event) => {

    const re = /[a-zA-Z0-9]+/g
    if (!re.test(event.key)) {
      event.preventDefault();
      return
    }

    if (event.key === "Enter") { // && event.target == newtagRef.current
      if (selectedGroup.groupTags.findIndex(item => item.name == tagTextRef.current) == -1 && tagTextRef != "") { //if nametag doesn't already exist in bd

        // console.log(colors)
        // console.log(groupInfo[activeIndex].groupTags.map(groupTag=>groupTag.color))
        const dbColors = selectedGroup.groupTags.map(groupTag => groupTag.color)
        // console.log(colors.filter(x => !dbColors.includes(x)))
        const filteredColors = colors.filter(x => !dbColors.includes(x)) //colors that are currently not in use in db tags

        if (filteredColors.length !== 0) { //while there are colors still available
          try {
            await api.post(`/expense/addtag`,
              {
                groupId: selectedGroup._id, //TODO check actual response
                groupTag: { name: tagTextRef.current, color: filteredColors[0] }
              })
          } catch (err) {
            console.dir("Adding tag Err", err)
          } finally {
            setTagText("")  //empty cell
            await fetchData()// !!!!!!!!!!!!!!!!!NEED TO RERENDER!!!!!!!!!!!!!!!!!!!!
            // console.log("added")
            //event.target.blur() //unfocus from cell
          }
        } else {
          return
        }
      }
    }
  }

  const handleGroupTagsDelete = async (tag) => {

    try {
      await api.post(`/expense/deletetag`,
        {
          groupId: selectedGroup._id,
          groupTag: { name: tag.name, color: tag.color, _id: tag._id }
        })
    } catch (err) {
      console.dir("deleting tag Err", err)
    } finally {
      await fetchData()
      console.log("deleted")
    }
  }

  const handleBlur = async () => {

    if (tagText != "" && selectedGroup.groupTags.findIndex(item => item.name === tagTextRef.current) == -1) {

      const dbColors = selectedGroup.groupTags.map(groupTag => groupTag.color)
      const filteredColors = colors.filter(x => !dbColors.includes(x))

      console.log(filteredColors, filteredColors.length)

      if (filteredColors.length !== 0) {
        try {
          await api.post(`/expense/addtag`,
            {
              groupId: selectedGroup._id,
              groupTag: { name: tagTextRef.current, color: filteredColors[0] }
            })
        } catch (err) {
          console.dir("groupTagErr", err)
        }
        setTagText("")  //empty cell
        await fetchData()//request group from DB
        //event.target.blur() //unfocus from cell
      } else {
        return
      }

    }
  }

  const addExpense = async () => {
    try {
      if (trackIndexAndIDmulti.length !== 0) {
        //TO DO
        //Will need to change the db request that gets you the group on potential merge.
        const res = await api.post(`/expense/addexpense`,
          {
            groupId: selectedGroup._id, //does it feed at first render? Need to check
            sender: sessionData.userId,
            amount: inputAmount,
            description: inputDescription,
            tobeSharedWith: [...trackIndexAndIDmulti.map(tracker => tracker._id), sessionData.userId], //only feed selected ids,
            expenseTags: expenseTags
          }
        )
        setInputAmount('')
        setInputDescription('')
        console.log(res)
      } else { //this might be redundant as all members exist in back end. Not sure how it's going to work yet
        //but knowing members.length, if nothing has been selected here it could just check this by
        //doing if members.length-shareWtih.length==1 then all users should be included.
        const res = await api.post(`/expense/addexpense`,
          {
            groupId: selectedGroup._id, //does it feed at first render? Need to check
            sender: sessionData.userId,
            amount: inputAmount,
            description: inputDescription,
            tobeSharedWith: [...selectedGroup.members.map(member => member._id), sessionData.userId],//feed all ids
            expenseTags: expenseTags
          }
        )
        setInputAmount('')
        setInputDescription('')
        console.log(res)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const filterIDfromMembers = (value) => { //removes userID from members
    if (String(value._id) !== sessionData.userId) {
      return value;
    }
  }

  const submitAndClose = () => {
    // submit()
    // closeBox()
    addExpense()
    dispatch(closeSlidingBox())
  }

  //remove {children} and add functions here (like in GroupSelector) so everything happens in this component
  return (
    <SlidingBox close={close} >
      {headline && <div className='form-headline'>{headline}</div>}
      <div className='input-field-section'>
        <InputField
          value={inputAmount}
          allowTags={false}
          placeholder={"Amount"}
          // maxLength={20}
          // required={true}
          onChange={e => setInputAmount(e.target.value)}
          clear={e => setInputAmount('')} //this is for the X button? How does the automatic clearing works on submit?
        />
        <InputField
          value={inputDescription}
          allowTags={true}
          setExpenseTags={setExpenseTags}
          setGroupTags={setShowGroupTags}
          expenseTags={expenseTags}
          placeholder={"Description"}
          // maxLength={100}
          // required={false}
          onChange={e => setInputDescription(e.target.value)}
          clear={e => setInputDescription('')}
        />
        <MultiSelect
          setTrackIndexAndID={setTrackIndexAndIDmulti}
          value={trackIndexAndIDmulti}
          optionsArray={selectedGroup.members.filter(filterIDfromMembers)} //filters out user's ID from showing as option. Debatable
          label="split expense between you and all members"
          splitAmongMembersCheck={splitAmongMembersCheck}
          setSplitAmongMembersCheck={setSplitAmongMembersCheck}
          allowMultiSelections={true} />
        <ExpenseTags
          groupTags={showGroupTags}
          setGroupTags={setShowGroupTags}
          expenseTags={expenseTags}
          setExpenseTags={setExpenseTags}
          tagText={tagText}
          setTagText={setTagText}
          maxLength={12}
          onChange={onChangeTagName}
          handleKeyDown={handleKeyDown}
          handleBlur={handleBlur}
          handleGroupTagsDelete={handleGroupTagsDelete}
          newtagRef={newtagRef}
          colors={colors}
        />
      </div>
      <div className='submit-button' onClick={submitAndClose}>Submit</div>
    </SlidingBox>
  );
}

function InputField({ value, label, maxLength,
  required, onChange, clear,
  placeholder, allowTags, expenseTags,
  setExpenseTags, setGroupTags }) {

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

      {allowTags && expenseTags.length !== 0 ?
        <div className='input-tagsection gap8'>

          {expenseTags.map((tag, index) =>
            <Tag
              key={index}
              showClose={true}
              text={tag.name}
              color={tag.color}
              onCloseClick={() => handleExpenseTagsClick(tag)} />
          )}
        </div> : ""
      }
      {/* {allowMembersTags ?
        <div className='input-tagsection gap8'>
          {splitAmongMembers.map((tag) =>
            <Tag
              showClose={true}
              text={tag.nickname}
              color="var(--inactiveColor)"
              onCloseClick={() => handleMembersTagsClick(tag)} />
          )}
        </div> : ""
      } */}

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
        {optionsArray.map((option, index) =>
          <Tag
            key={index}
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



function MultiSelect({ optionsArray, setTrackIndexAndID, allowMultiSelections, label, value, splitAmongMembersCheck, setSplitAmongMembersCheck }) {

  const onSubmitFunction = (allowMultiSelections, option, index) => {
    if (allowMultiSelections) {
      setSplitAmongMembersCheck(false)
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


  const handleTickBox = () => {
    setSplitAmongMembersCheck(prev => !prev)
    setTrackIndexAndID([])
  }

  // value.findIndex(item => item.index === index) == -1
  return (
    <div className='flex column '>

      <div className='multiselect-description '>

        <div className='tick-cube' onClick={handleTickBox}>
          {splitAmongMembersCheck ? <i className='check icon avatarcheck headercheck'></i> : ""}
        </div>
        <div className='label'>
          {label}
        </div>
      </div>

      <div className='multiselectbox'>

        {optionsArray.map((option, index) =>
          <div className='flex column profilecircle' key={index} onClick={() => onSubmitFunction(allowMultiSelections, option, index)} >

            <span className='avatar'>
              <div className='firstLetter'>
                {option.nickname.charAt(0)}
              </div>
              {value.findIndex(item => item.index === index) == -1 ? "" :
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
      </div>
    </div>
  )
}



function ExpenseTags({ groupTags, setGroupTags, expenseTags, setExpenseTags, tagText, maxLength, onChange, handleKeyDown, handleBlur, newtagRef, colors, handleGroupTagsDelete }) {

  const [showTrash, setShowTrash] = useState(false)

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
        Select <i className="tag icon newtagIcon"></i>
      </div>
      {!showTrash ?
        <div className='multiselectbox tobeSelectedTags'>

          {groupTags.map((tag, index) =>
            <Tag
              key={index}
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


          <div className='deleteTagSection' onClick={() => setShowTrash(true)}>
            <i className="trash alternate icon deleteTagButton"></i>
          </div>
        </div>
        :
        <div className='multiselectbox tobeSelectedTags'>

          {groupTags.map((tag, index) =>
            <Tag
              key={index}
              showClose={false}
              showTrash={true}
              text={tag.name}
              color={tag.color}
              onDeleteClick={() => handleGroupTagsDelete(tag)} />
          )}

          <div className='checkTagSection' onClick={() => setShowTrash(!true)}>
            <i className="check icon checkTagButton"></i>
          </div>
        </div>}


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

// Form.MembersTags = MembersTags;
// Form.ExpenseTags = ExpenseTags;
// Form.InputField = InputField;
// Form.DropDownField = DropDownField;
// Form.MultiSelect = MultiSelect;

export default Form;
