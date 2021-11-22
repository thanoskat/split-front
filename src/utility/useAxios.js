import axios from 'axios'
import { useContext } from 'react'
import { AuthenticationContext } from '../AuthenticationContext'

const baseURL = 'http://localhost:4000'

const useAxios = () => {


  const { signOut, refreshAccessToken } = useContext(AuthenticationContext)
  const accessToken = window.localStorage.getItem('accessToken')

  // Goes to header and gets access token so we don't have to bother with
  // Writting this piece of code every time it is required.
  const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${accessToken}`}
  })

  // Intercepts at request
  axiosInstance.interceptors.request.use(async request => {
    return request
  })

  // Intercepts at response, so when unauthorized (401) you ask for a new access token
  axiosInstance.interceptors.response.use(async response => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if(error.response) {
      // Checking for retry property to prevent infinite loop
      if(error.response.status === 401 && !originalRequest.retry) {
        try {
          const refreshResponse = await axios.get(`${baseURL}/auth/refreshtoken`, {withCredentials: true})  //Tries to get access token
          // console.dir("REFRESHRESPONSE: ", refreshResponse)
          const { accessToken } = refreshResponse.data
          console.log("REFRESHING ACCESS TOKEN WITH: ", accessToken)
          refreshAccessToken(accessToken)
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
          try {
            // Creating a property "retry" and setting to true to prevent infinite loop
            originalRequest.retry = true
            // Retries to submit request that was initially denied (401)
            return axiosInstance(originalRequest);
          }
          catch(retryError) {
            console.dir("RETRYERROR: ", retryError)
          }
        }
        catch(error) {
          // console.dir("REFRESHERROR", error)
          signOut()
        }
      }
    }
    return Promise.reject(error)
  })
  return axiosInstance
}

export default useAxios
