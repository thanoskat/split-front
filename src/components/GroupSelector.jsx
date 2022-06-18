import { useState, useEffect, useRef } from 'react'
import store from '../redux/store'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'
import { Link, useLocation } from 'react-router-dom'

const GroupSelector = () => {

  const api = useAxios()
  const abortControllerRef = useRef(null)
  const location = useLocation()
  const selectedGroup = store.getState().mainReducer.selectedGroup

  const [groupList, setGroupList] = useState()
  const [loading, setLoading] = useState(true)

  let currentTab = ''
  const part = location.pathname.split(/[/]/g)
  if(part.length > 2) {
    currentTab = `/${part[2]}`
  }

  const getGroups = async () => {
    try {
      console.log('getGroups()')
      const response = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log('/groups/mygroups', response.data)
      setGroupList(response.data)
    }
    catch(error) {
      console.log(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    getGroups()
    return () => {
      abortControllerRef.current.abort()
    }
  // eslint-disable-next-line
  },[])

  console.log('loading', loading)

  return (
    <div className={`group-selector top-radius${!loading ? ' my-animation' : ''}`} style={{zIndex: '3'}}>
      <div className='flex row t05 justcont-center alignitems-center padding4'>
        Group
        {loading && <IonIcon name='sync' className='t1 spin'/>}
      </div>
      {/* <div className='separator-0'/> */}
      {groupList &&
      <div className={`flex column gap4 padding4`}>
        {groupList?.map((group, index) => (
          <Link
            key={group._id}
            to={`/${group._id}${currentTab}`}
            className={`${group._id === selectedGroup?._id ? 'highlighted-group' : ''} group-selector-button medium flex row overflow-hidden justcont-spacebetween alignitems-center t3 padding1812 pointer shadow`}
          >
            {group.title}
            <div className='regular flex row t3 gap6 alignitems-center'>
              <IonIcon name='people-sharp' />
              <div>{group.members.length}</div>
            </div>
          </Link>
        ))}
      </div>
      }
    </div>
  );
}

export default GroupSelector
