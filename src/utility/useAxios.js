import axios from 'axios'
import { useContext } from 'react'
import { AuthenticationContext } from '../AuthenticationContext'

const baseURL = 'http://localhost:4000'

const useAxios = () => {
  const { signOut, refreshAccessToken } = useContext(AuthenticationContext)
  const accessToken = window.localStorage.getItem('accessToken')

  const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${accessToken}`}
  })

  axiosInstance.interceptors.request.use(async request => {
    return request
  })

  axiosInstance.interceptors.response.use(async response => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if(error.response) {
      if(error.response.status === 401 && !originalRequest.retry) {
        try {
          const refreshResponse = await axios.get(`${baseURL}/auth/refreshtoken`, {withCredentials: true})
          console.dir("REFRESHRESPONSE: ", refreshResponse)
          const { accessToken } = refreshResponse.data
          console.log("REFRESHING ACCESS TOKEN WITH: ", accessToken)
          refreshAccessToken(accessToken)
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
          try {
            originalRequest.retry = true
            return axiosInstance(originalRequest);
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
