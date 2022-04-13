import { SlidingBox, Tag } from './'
import { useRef, useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import "../style/Form.css"
import { setSelectedGroup } from '../redux/mainSlice'
import IonIcon from '@reacticons/ionicons'
//TODO LIST
// 1. fix ticker box - kick div showing users when ticker is on. Get rid of row 77 as a result //DONE
// 2. populate add expense routers and dispatch selected group //DONE
// 3. fix tenekedes //DONE
// 4. Turn profiles into pills
// 5. timestamp on submit expense //DONE
// 6. WHAT HAPPENS WHEN USER HAS DECIDED NOT TO SHARE WITH ALL, DOESN'T CHOOSE ANYONE AND CLICK SUBMIT row 168 DONE
// 7. up-down border radius for description
// 8. abort controller for input doesn't re-render page
// 9. slow down submit expense and check whether submit loading makes sense (might be redundant)


function Form({ headline, close }) {

  console.log("Form Rendered")
  const api = useAxios()
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [trackIndexAndIDmulti, setTrackIndexAndIDmulti] = useState([])
  const [inputDescription, setInputDescription] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [expenseTags, setExpenseTags] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [submitisLoading, setSubmitLoading] = useState(false)
  const [clickedIndex, setClickedIndex] = useState()

  //console.log(selectedGroup.groupTags)

  const showGroupTags = [...getDifference(selectedGroup.groupTags, expenseTags), ...getDifference(expenseTags, selectedGroup.groupTags)] //run twice in case first array has less objects than second (seems impossible). See row 58
  const [tagText, setTagText] = useState("");
  const [splitAmongMembersCheck, setSplitAmongMembersCheck] = useState(true)

  const tagTextRef = useRef(tagText)
  const newtagRef = useRef(null)
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()

  //console.log(selectedGroup)

  // useEffect(() => {
  //   fetchData()
  // }, [splitAmongMembersCheck])

  useEffect(() => {
    abortControllerRef.current = new AbortController;
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

  //some returns true if the condition is satisfied at least once.
  //if the id we're interested in is found at least once in the second array it returns true (found).
  //this id is not what we need though so it is filtered out.
  //hence we only keep objects with ids that only exist in one array and not the other.
  //run twice in case first array has less objects than second
  //example: first array only has one object. This will be filtered out (as filter is applied on first array only) leaving an empty filtered array
  //https://bobbyhadz.com/blog/javascript-get-difference-between-two-arrays-of-objects
  
  function getDifference(array1, array2) {
    return array1.filter(object1 => { //(filter keeps whatever the function inside it tell it to keep)
      return !array2.some(object2 => {
        return object1._id === object2._id;
      });
    });
  }


  const fetchData = () => {

    //When a tag is created, fetchData runs again updating the groupTags, feeding them into the available options for the user.
    //the line below solves the problem where a user has already chosen a tag and decides to create a new one. By filtering the tag
    //that has already been chosen (the one in the "downTags array") we prohibit it from appearing in the available options (so avoid showing it twice)
    //const difference = [...getDifference(selectedGroup.groupTags, expenseTags), ...getDifference(expenseTags, selectedGroup.groupTags)]
    //setShowGroupTags(difference)

    //not sure that's the right way
    //if (splitAmongMembersCheck) { setTrackIndexAndIDmulti(selectedGroup.members.filter(filterIDfromMembers).map((option, index) => ({ _id: option._id, index: index }))) }

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

  const onCreateTag = async () => {
    const dbColors = selectedGroup.groupTags.map(groupTag => groupTag.color)
    const filteredColors = colors.filter(x => !dbColors.includes(x)) //colors that are currently not in use in db tags

    if (filteredColors.length !== 0 && !isLoading) { //while there are colors still available
      setLoading(true)
      try {
        const res = await api.post(`/expense/addtag`,
          {
            groupId: selectedGroup._id, //TODO check actual response
            groupTag: { name: tagTextRef.current, color: filteredColors[0] }
          }, { signal: abortControllerRef.current.signal })
        setLoading(false)
        //console.log(res.data)
        dispatch(setSelectedGroup(res.data))
      } catch (err) {
        console.dir("Adding tag Err", err)
      } finally {
        setTagText("")  //empty cell
      }
    } else {
      return
    }
  }

  const handleKeyDown = async (event) => {

    const re = /[a-zA-Z0-9]+/g
    console.log(event)
    if (!re.test(event.key)) {
      event.preventDefault();
      return
    }
    if (event.key === "Enter") { // && event.target == newtagRef.current
      if (selectedGroup.groupTags.findIndex(item => item.name == tagTextRef.current) == -1 && tagTextRef != "") { //if nametag doesn't already exist in bd
        await onCreateTag()
      }
    }
  }

  const handleGroupTagsDelete = async (tag, index) => {
    //TODO Need an if(!isLoading)
    setClickedIndex(index)
    setLoading(true)
    try {
      const res = await api.post(`/expense/deletetag`,
        {
          groupId: selectedGroup._id,
          groupTag: { _id: tag._id }
        }, { signal: abortControllerRef.current.signal })
      setLoading(false)
      dispatch(setSelectedGroup(res.data))

    } catch (err) {
      console.dir("deleting tag Err", err)
    } finally {

      console.log("deleted")
    }
  }

  const handleBlur = async () => {
    if (tagText != "" && selectedGroup.groupTags.findIndex(item => item.name === tagTextRef.current) == -1) {
      await onCreateTag()
    }
  }

  const addExpense = async () => {
    if (!inputAmount) return
    setSubmitLoading(true)
    try {
      if (splitAmongMembersCheck) {
        //If all members have been chosen
        const res = await api.post(`/expense/addexpense`,
          {
            groupId: selectedGroup._id, //does it feed at first render? Need to check
            sender: sessionData.userId,
            amount: inputAmount,
            description: inputDescription,
            tobeSharedWith: [...selectedGroup.members.map(member => member._id)],//feed all ids tobeSharedWith: [...selectedGroup.members.map(member => member._id), sessionData.userId]
            expenseTags: expenseTags
          },{ signal: abortControllerRef.current.signal }
        )
        setSubmitLoading(false)
        setInputAmount('')
        setInputDescription('')
        dispatch(setSelectedGroup(res.data))

      } else if (trackIndexAndIDmulti.length !== 0) {
        //else if a member has been chosen
        const res = await api.post(`/expense/addexpense`,
          {
            groupId: selectedGroup._id, //does it feed at first render? Need to check
            sender: sessionData.userId,
            amount: inputAmount,
            description: inputDescription,
            tobeSharedWith: [...trackIndexAndIDmulti.map(tracker => tracker._id), sessionData.userId], //only feed selected ids,
            expenseTags: expenseTags
          },{ signal: abortControllerRef.current.signal }
        )
        setSubmitLoading(false)
        setInputAmount('')
        setInputDescription('')
        dispatch(setSelectedGroup(res.data))
      } else {
        //if no member has been chose at all
        return //do nothing if trackIndexAndIDmulti.length == 0 and not all users are selected
      }
    }
    catch (error) {
      console.log(error)
    }
    dispatch(closeSlidingBox())
  }

  const filterIDfromMembers = (value) => { //removes userID from members
    if (String(value._id) !== sessionData.userId) {
      return value;
    }
  }

  // const submitAndClose = async () => {
  //   // submit()
  //   // closeBox()
  //   if (!inputAmount) return
  //   await addExpense()
  //   dispatch(closeSlidingBox())


  // }

  //remove {children} and add functions here (like in GroupSelector) so everything happens in this component
  return (
    <SlidingBox close={close} className='addExpense-selector top-radius' >
      {headline && <div className='flex row t05 justcont-center alignitems-center padding4'>{headline}</div>}
      <div className='separator-0' />
      <div className='flex column padding4'>
        <InputField
          value={inputAmount}
          allowTags={false}
          numbersOnly={true}
          placeholder={"Amount"}
          // maxLength={20}
          // required={true}
          onChange={e => setInputAmount(e.target.value)}
          clear={e => setInputAmount('')} //this is for the X button? How does the automatic clearing works on submit?
        />
        <InputField
          value={inputDescription}
          allowTags={true}
          numbersOnly={false}
          setExpenseTags={setExpenseTags}
          //setGroupTags={setShowGroupTags}
          expenseTags={expenseTags}
          placeholder={"Description"}
          // maxLength={100}
          // required={false}
          onChange={e => setInputDescription(e.target.value)}
          clear={e => setInputDescription('')}
        />
        <ExpenseTags
          groupTags={showGroupTags}
          //setGroupTags={setShowGroupTags}
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
          isLoading={isLoading}
          setClickedIndex={setClickedIndex}
          clickedIndex={clickedIndex}
        />
        <MultiSelect
          setTrackIndexAndID={setTrackIndexAndIDmulti}
          value={trackIndexAndIDmulti}
          optionsArray={selectedGroup.members.filter(filterIDfromMembers)} //filters out user's ID from showing as option. Debatable
          label="split between you and all members"
          splitAmongMembersCheck={splitAmongMembersCheck}
          setSplitAmongMembersCheck={setSplitAmongMembersCheck}
          allowMultiSelections={true} />

        <div className='submit-button-container v-flex alignitems-center justcont-center'>
          <div
            className={`submit-button ${inputAmount ? "active" : null} h-flex justcont-spacearound `}
            onClick={addExpense}>
              {submitisLoading? <IonIcon name='sync' className='t3 spin' />: "Submit"}
          </div>
        </div>
      </div>

    </SlidingBox>
  );
}

function InputField({ value, label, maxLength,
  required, onChange, clear,
  placeholder, allowTags, expenseTags,
  setExpenseTags,numbersOnly }) {

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
    //setGroupTags(prevTag => [...prevTag, tag])
  }


  return (
    <div className='single-input-section'>
      <input
        className='input-field'
        placeholder={placeholder}
        value={value}
        onChange={(e)=>checkLengthAndChange(e)}
        spellCheck='false'
        ref={inputFieldRef}
      />
      {value && <i className='input-clear-icon times icon' onClick={clearAndFocus} />}

      {allowTags && expenseTags.length !== 0 ?
        <div className='input-tagsection gap8'>

          {expenseTags.map((tag) =>
            <Tag
              key={tag._id}
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
        {optionsArray.map((option) =>
          <Tag
            key={option._id}
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


      {!splitAmongMembersCheck ?  //CHECK WHETHER TO SHOW MEMBERS TO BE SELECTED OR NOT

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
        </div> : ""

      }


    </div>
  )
}



function ExpenseTags({ groupTags, expenseTags, setExpenseTags, tagText, maxLength, onChange, handleKeyDown, handleBlur, newtagRef, colors, handleGroupTagsDelete, isLoading, clickedIndex }) {

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
    //setGroupTags(groupTags.filter(item => item.name !== tag.name))
    setExpenseTags(prevTag => [...prevTag, tag])

  }

  // const handleDownTagsClick = (tag) => {
  //   setDownTags(downTags.filter(item => item.name !== tag.name))
  //   setUpTags(prevTag => [...prevTag, tag])
  // }

  return (
    <div className='Tags v-flex'>
      <div className='tags-header'>
        Select <i className="tag icon newtagIcon selectTag"></i>
      </div>

      {!showTrash ?
        <div className='multiselectbox tobeSelectedTags'>

          {groupTags.map((tag, index) =>
            <Tag
              key={tag._id}
              showClose={false}
              text={tag.name}
              color={tag.color}
              onBodyClick={() => handleGroupTagsClick(tag, index)}
            />
          )}

          {isLoading ? <IonIcon name='sync' className='t3 spin' /> : ""}

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
              key={tag._id}
              showClose={false}
              showTrash={true}
              text={tag.name}
              color={tag.color}
              onDeleteClick={() => handleGroupTagsDelete(tag, index)}
              index={index}
              isLoading={isLoading}
              clickedIndex={clickedIndex} />
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
