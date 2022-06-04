import { useState, useEffect, useRef } from 'react'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import populateLabels from '../utility/populateLabels'
import IonIcon from '@reacticons/ionicons'
import { useSearchParams, Link, useLocation } from 'react-router-dom'

const GroupSelector2 = () => {

  const dispatch = useDispatch()
  const api = useAxios()
  const abortControllerRef = useRef(null)
  const location = useLocation()
  const selectedGroup = store.getState().mainReducer.selectedGroup

  const [isLoading, setLoading] = useState(false)
  const [clickedIndex, setClickedIndex] = useState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [groupList, setGroupList] = useState()

  let tab = ''
  const part = location.pathname.split(/[/]/g)
  if(part.length > 2) {
    tab = `/${part[2]}`
  }

  const getGroups = async () => {
    try {
      const response = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log("/groups/mygroups", response.data)
      setGroupList(response.data)
    }
    catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    getGroups()
    return () => {
      abortControllerRef.current.abort()
    }
  },[])

  return (
    <div className='group-selector top-radius' style={{zIndex: '3'}}>
      <div className='flex row t05 justcont-center alignitems-center padding4'>Group</div>
      {/* <div className='separator-0'/> */}
      <div className='flex column gap4 padding4'>
        {groupList?.map((group, index) => (
          <Link
            key={group._id}
            to={`/${group._id}${tab}`}
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
    </div>
  );
}

export default GroupSelector2
