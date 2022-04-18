import { SlidingBox } from './'
import { useRef, useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import "../style/Form.css"
import { setSelectedGroup } from '../redux/mainSlice'
import IonIcon from '@reacticons/ionicons'

function RecordPayment({ headline, close}) {

  console.log("Form Rendered")
 
  const api = useAxios()
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const selectedPendingTX = store.getState().mainReducer.selectedPendingTX  

  const [trackIDsingle, setTrackIDsingle] = useState([selectedPendingTX.receiver._id])
  const [inputDescription, setInputDescription] = useState("Settle payment")
  const [inputAmount, setInputAmount] = useState(selectedPendingTX.amount)
  const [submitisLoading, setSubmitLoading] = useState(false)

  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  console.log(inputAmount==="")

  useEffect(() => {
    abortControllerRef.current = new AbortController;
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])


  const recordPayment = async () => {
    //console.log(trackIDsingle)
    //console.log("ID",utilities.tobeRetrievedOption[0]._id)
    if (trackIDsingle.length === 0) return null; //do not proceed to recording tx if no user has been selected
    if (inputAmount === "") return null; //do not proceed to recording tx if no amount has been given
    setSubmitLoading(true)
    try {
      const res = await api.post(`/expense/addtransfer`,
        {
          groupId: selectedGroup._id, //does it feed at first render? Need to check
          sender: sessionData.userId,
          receiver: trackIDsingle[0],
          amount: inputAmount,
          description: inputDescription
        }, { signal: abortControllerRef.current.signal }
      )
      setSubmitLoading(false)
      setInputAmount('')
      setInputDescription('')
      dispatch(setSelectedGroup(res.data))
      console.log(res)
    }
    catch (error) {
      console.log(error)
    }
    dispatch(closeSlidingBox())
  }

  //   const addExpense = async () => {
  //     if (!inputAmount) return
  //     setSubmitLoading(true)
  //     try {
  //       if (splitAmongMembersCheck) {
  //         //If all members have been chosen
  //         const res = await api.post(`/expense/addexpense`,
  //           {
  //             groupId: selectedGroup._id, //does it feed at first render? Need to check
  //             sender: sessionData.userId,
  //             amount: inputAmount,
  //             description: inputDescription,
  //             tobeSharedWith: [...selectedGroup.members.map(member => member._id)],//feed all ids tobeSharedWith: [...selectedGroup.members.map(member => member._id), sessionData.userId]
  //             expenseTags: expenseTags
  //           },{ signal: abortControllerRef.current.signal }
  //         )
  //         setSubmitLoading(false)
  //         setInputAmount('')
  //         setInputDescription('')
  //         dispatch(setSelectedGroup(res.data))

  //       } else if (trackIndexAndIDmulti.length !== 0) {
  //         //else if a member has been chosen
  //         const res = await api.post(`/expense/addexpense`,
  //           {
  //             groupId: selectedGroup._id, //does it feed at first render? Need to check
  //             sender: sessionData.userId,
  //             amount: inputAmount,
  //             description: inputDescription,
  //             tobeSharedWith: [...trackIndexAndIDmulti.map(tracker => tracker._id), sessionData.userId], //only feed selected ids,
  //             expenseTags: expenseTags
  //           },{ signal: abortControllerRef.current.signal }
  //         )
  //         setSubmitLoading(false)
  //         setInputAmount('')
  //         setInputDescription('')
  //         dispatch(setSelectedGroup(res.data))
  //       } else {
  //         //if no member has been chose at all
  //         return //do nothing if trackIndexAndIDmulti.length == 0 and not all users are selected
  //       }
  //     }
  //     catch (error) {
  //       console.log(error)
  //     }
  //     dispatch(closeSlidingBox())
  //   }

  const filterIDfromMembers = (value) => { //removes userID from members
    if (String(value._id) !== sessionData.userId) {
      return value;
    }
  }

  //remove {children} and add functions here (like in GroupSelector) so everything happens in this component
  return (
    <SlidingBox close={close} className='addExpense-selector top-radius' >
      {headline && <div className='flex row t05 justcont-center alignitems-center padding4'>{headline}</div>}
      <div className='separator-0' />
      <div className='flex column padding4'>
        <InputField
          value={inputAmount}
          placeholder={"Amount"}
          // maxLength={20}
          // required={true}
          onChange={e => setInputAmount(e.target.value)}
          clear={e => setInputAmount('')} //this is for the X button? How does the automatic clearing works on submit?
        />
        <InputField
          value={inputDescription}
          placeholder={"Description"}
          // maxLength={100}
          // required={false}
          onChange={e => setInputDescription(e.target.value)}
          clear={e => setInputDescription('')}
        />

        <MultiSelect
          setTrackID={setTrackIDsingle}
          value={trackIDsingle}
          optionsArray={selectedGroup.members.filter(filterIDfromMembers)} //filters out user's ID from showing as option. Debatable
          allowMultiSelections={false} />

        <div className='submit-button-container v-flex alignitems-center justcont-center'>
          <div
            className={`submit-button ${inputAmount && trackIDsingle.length!==0 ? "active" : null} h-flex justcont-spacearound `}
            onClick={recordPayment}>
            {submitisLoading ? <IonIcon name='sync' className='t3 spin' /> : "Submit"}
          </div>
        </div>
      </div>

    </SlidingBox>
  );
}

function InputField({ value, label, maxLength,
  required, onChange, clear,
  placeholder }) {

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

  return (
    <div className='single-input-section'>
     
      <input
        className='input-field'
        placeholder={placeholder}
        value={value}
        onChange={(e) => checkLengthAndChange(e)}
        spellCheck='false'
        ref={inputFieldRef}
      />
      {value && <i className='input-clear-icon times icon' onClick={clearAndFocus} />}

      <div className='input-label-section'>
        <div className='input-label'>{label}</div>
        {maxLength &&
          <div
            className='input-right-label'
            style={required && value.length === 0 ? { color: 'red' } : {}}
          >
            {`${value.length}/${maxLength}`}
          </div>
        }
      </div>
    </div>
  )
}

function MultiSelect({ optionsArray, setTrackID, allowMultiSelections, label, value }) {

  const onSubmitFunction = (allowMultiSelections, option) => {
    if (value?.includes(option._id)) { //if ID is not in the array, push it
      setTrackID(value.filter(item => item !== option._id))
    } else {
      if (allowMultiSelections) {
        setTrackID([...value, option._id])
      } else {
        setTrackID([option._id])
      }
    }
  }

  //console.log("value",value)
  //console.log(optionsArray)
  // console.log("optionsArr", optionsArray.map(option=>option._id).includes(value[0]._id))
  // value.findIndex(item => item.index === index) == -1
  return (
    <div className='flex column '>

      <div className='multiselect-description '>

      </div>

      <div className='label'>
        {label}
      </div>

      <div className='multiselectbox'>
        {optionsArray.map((option) =>
          <div className='flex column profilecircle' key={option._id} onClick={() => onSubmitFunction(allowMultiSelections, option)} >
            <span className='avatar'>
              <div className='firstLetter'>
                {option.nickname.charAt(0)}
              </div>
              {!value?.includes(option._id) ? "" :
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

export default RecordPayment;
