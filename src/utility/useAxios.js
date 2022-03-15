import axios from 'axios'
import { useContext } from 'react'
import { AuthenticationContext } from '../contexts/AuthenticationContext'

const baseURL = 'http://localhost:4000'

const useAxios = () => {


  const { accessToken, signOut, refreshAccessToken } = useContext(AuthenticationContext)
  // const accessToken = window.localStorage.getItem('accessToken')

  // Goes to header and gets access token so we don't have to bother with
  // Writting this piece of code every time it is required.
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
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
      console.log(`Response error ${error.response.data}`, error.response.status)
      if(error.response.status === 401 && !originalRequest.retry) {
        try {
          const refreshResponse = await axios.get(`${baseURL}/auth/refreshtoken`, {withCredentials: true})  //Tries to get access token
          const { newAccessToken } = refreshResponse.data
          console.log("Refreshing access token with", newAccessToken.slice(newAccessToken.length - 10))
          refreshAccessToken(newAccessToken)
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          try {
            // Creating a property "retry" and setting to true to prevent infinite loop
            originalRequest.retry = true
            // Retries to submit request that was initially denied (401)
            return axiosInstance(originalRequest)
          }
          catch(error) {
            console.log("Retry error", error.message)
          }
        }
        catch(error) {
          console.log(`Refresh response error ${error.response.data}`, error.response.status)
          if(error.response.status === 419) {
            return axiosInstance(originalRequest)
          }
          else {
            console.log('Signing out.')
            signOut()
          }
        }
      }
      else if(error.response.status === 419) {
        return axiosInstance(originalRequest)
      }
    }
    return Promise.reject(error)
  })
  return axiosInstance
}

export default useAxios
