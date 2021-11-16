import axios from 'axios'
import { useContext } from 'react'
import { AuthenticationContext } from '../AuthenticationContext'

const baseURL = 'http://localhost:4000'

const useAxios = () => {

  //goes to header and gets access token so we don't have to bother with 
  //writting this piece of code every time it is required.
  const { signOut, refreshAccessToken } = useContext(AuthenticationContext)
  const accessToken = window.localStorage.getItem('accessToken')

  const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${accessToken}`}
  })

  axiosInstance.interceptors.request.use(async request => {  
    return request
  })
//if access token expires it requests for a new one
  axiosInstance.interceptors.response.use(async response => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if(error.response) {
      if(error.response.status === 401 && !originalRequest.retry) {
        try {
          const refreshResponse = await axios.get(`${baseURL}/auth/refreshtoken`, {withCredentials: true})  //Tries to get access token
          console.dir("REFRESHRESPONSE: ", refreshResponse)
          const { accessToken } = refreshResponse.data
          console.log("REFRESHING ACCESS TOKEN WITH: ", accessToken) 
          refreshAccessToken(accessToken)
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
          try {
            originalRequest.retry = true
            return axiosInstance(originalRequest);    //Tries to submit request that was initially denied
          }
          catch(retryError) {
            console.dir("RETRYERROR: ", retryError)
          }
        }
        catch(error) {
          console.dir("REFRESHERROR", error)
          signOut()
        }
      }
    }
    return Promise.reject(error)
  })
  return axiosInstance
}

export default useAxios
