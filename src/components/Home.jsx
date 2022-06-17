import React from 'react'
import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import { Link } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import store from '../redux/store'
import { useSearchParams } from 'react-router-dom'
import { CreateNewGroup } from '.'
import { CSSTransition } from 'react-transition-group'

export default function Home() {

  const api = useAxios()
  const abortControllerRef = useRef(null)
  const [groupList, setGroupList] = useState()
  const [isLoading, setIsloading] = useState(false)
  const sessionData = store.getState().authReducer.sessionData
  const [searchParams, setSearchParams] = useSearchParams()


  const getGroups = async () => {
    setIsloading(true)
    try {
      const response = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log("/groups/mygroups", response.data)
      setGroupList(response.data)
      setIsloading(false)
    }
    catch (error) {
      console.log(error.message)
      setIsloading(false)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    getGroups()
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

  return (
    <div id="homepage" className=' flex column ' style={{ color: "var(--light-color)" }}>
      <div className='logo t66 flex alignitems-center'>
        α
      </div>
      <div className='welcomemsg whiteSpace-initial'>
        Welcome {sessionData.userNickname}, what would you like to do?
      </div>
      <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
        <div style={{ padding: "0 0 1rem 0" }}>
          Return to a group
        </div>
        <div className='whiteSpace-initial'>
          <div className='flex column gap4 padding4'>
            {isLoading && <IonIcon name='sync' className='t3 spin alignself-center' />}
            {groupList?.map((group) => (
              <Link
                key={group._id}
                to={`/${group._id}/expenses`}
                className="group-selector-button medium flex row overflow-hidden alignitems-center t3 padding1812 pointer shadow justcont-center">
                {group.title}
                <div className='regular flex row t3 gap6 alignitems-center'>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="or flex justcont-center alignitems-center" style={{ color: "var(--light-color)" }}>OR</div>
      <div style={{ padding: "0 0 2rem 0" }}>
        <div className="shadow createnewgroup-button flex justcont-center relative alignitems-center" onClick={() => setSearchParams({ menu: 'createnewgroup' })}>Create new group</div>
      </div>

      <CSSTransition
        in={(searchParams.get('menu') === 'createnewgroup')}
        timeout={300}
        classNames='leftslide'
        unmountOnExit
      >
        <CreateNewGroup setSearchParams={setSearchParams}/>
      </CSSTransition>

    </div>
  )
}
