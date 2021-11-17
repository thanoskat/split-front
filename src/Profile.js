import './App.css';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'

function Profile(){

  const [user, setUser] = useState({})

  const api = useAxios()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try{
      const response = await api.get('/getusers/profile')  
      console.log(response.data)
      setUser(response.data)
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }


    return(
        <div>
      {user._id}
             
        </div>
    )

}

export default Profile;