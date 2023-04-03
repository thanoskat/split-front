import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { setToggle, setSelectedGroup } from '../redux/mainSlice'

function NewGuest2({ openMenu }) {

  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const toggle = useSelector(state => state.mainReducer.toggle)
  //console.log(selectedGroup)
  const [loading, setLoading] = useState(false)
  const [guestName, setGuestName] = useState()

  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [signUpErrorMessages, setSignUpErrorMessages] = useState({})
  const api = useAxios()
  const abortControllerRef = useRef(new AbortController())
  const dispatch = useDispatch()

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])

  const submitGuest = async () => {
    //e.preventDefault()
    setSignUpErrorMessages({})
    setSubmitErrorMessage('')
    setLoading(true)
    try {
      const res = await api.post('/guest/createguest',
        {
          name: guestName,
          groupId: selectedGroup.id,

        },
        { signal: abortControllerRef.current.signal }
      )
      setLoading(false)
      dispatch(setSelectedGroup(res.data))
      dispatch(setToggle(!toggle))
      openMenu(null)
    }
    catch (error) {
      if (error.response) {
        console.log(error.response)
        if (Array.isArray(error.response.data)) {

          const tempErrorMessages = {}
          error.response.data.reverse().forEach(err => {
            if (err.field === 'nickname') tempErrorMessages.nickname = err.message
            if (err.field === 'email') { tempErrorMessages.email = err.message }
          })
          setSignUpErrorMessages(tempErrorMessages)
        }
        if (error.response.data.message) {
          setSubmitErrorMessage(error.response.data.message)
        }
      }
      else {
        if (error.message === 'Network Error') setSubmitErrorMessage('Unable to establish connection to server')
        else setSubmitErrorMessage(error.message)
      }
      setLoading(false)
    }

  }

  const changeName = (e) => {
    setSignUpErrorMessages({ ...signUpErrorMessages, name: null })
    setGuestName(e.target.value)
    setSubmitErrorMessage('')
  }


  return (
    <div id='new-expense' className='flex column fixed'>
      <div id='menu-header' className='flex row'>
        <div className='cancelIcon alignself-center pointer' onClick={() => openMenu(null)}>
          <i className='arrow left icon'></i>
        </div>
        <div>
          Add Guest
        </div>
      </div>
      <div className='inputsAndOptions-container flex column gap10 padding1010'>
        <div className='flex relative column'>
          <input
            className={`styledInput ${signUpErrorMessages.nickname ? 'inputErr' : ''}`}
            placeholder='name'
            value={guestName}
            onChange={e => changeName(e)}
            spellCheck='false'
            autoFocus={true}
          />
          {!signUpErrorMessages.nickname && <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Guest's name</div>}
          {signUpErrorMessages.nickname && <div className='mailmsg t6'>{signUpErrorMessages.nickname}</div>}
        </div>


      </div>
      <div style={{ marginTop: 'auto' }}>
        <div
          id='new-expense-submit'
          onClick={submitGuest}
        >
          {loading && <IonIcon name='sync' className='spin' />}
          {!loading && <div>Submit</div>}
        </div>
        {submitErrorMessage && <div className='mailmsg t6 alignself-center'>{submitErrorMessage}</div>}
      </div>

    </div>
  )
}

export default NewGuest2