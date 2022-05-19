import axios from 'axios'
import { useDispatch } from 'react-redux'
import { refreshAccessToken, signOut } from '../redux/authSlice'
import store from '../redux/store'

const baseURL = `${process.env.REACT_APP_APIURL}`

const refresh = {
  refreshSubscribers: [],
  isRefreshing: false
}

const useAxios = () => {

  const dispatch = useDispatch()

  const onRrefreshed = (token) => {
    while(refresh.refreshSubscribers.length > 0){
      try {
        refresh.refreshSubscribers.shift()(token)
      }
      catch(error) {
        console.log(error)
      }
    }
  }

  // Adds a header with access token to every api request
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${store.getState().authReducer.accessToken}`
    }
  })

  // Intercepts at request
  axiosInstance.interceptors.request.use(async request => {
    // console.log(request.headers['Authorization'])
    return request
  })

  // Intercepts at response, so when unauthorized (401) you ask for a new access token
  axiosInstance.interceptors.response.use(async response => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const errorStatus = error.response.status
    console.log(errorStatus, error.response.data)

    // console.log(`errorStatus === ${errorStatus}`)
    if (errorStatus === 401) {
      // console.log(`isRefreshing === ${refresh.isRefreshing}`)
      if(!refresh.isRefreshing) {
        refresh.isRefreshing = true
        // Getting new access token
        axios.get(`${baseURL}/auth/refreshtoken`, {withCredentials: true})
        .then(response => {
          dispatch(refreshAccessToken(response.data.newAccessToken))
          refresh.isRefreshing = false
          onRrefreshed(store.getState().authReducer.accessToken)
        }).catch(error => {
          refresh.isRefreshing = false
          onRrefreshed(store.getState().authReducer.accessToken)
          refresh.refreshSubscribers = []
          console.log(error.response.status, error.response.data)
          dispatch(signOut())
        })
      }

      const retryOriginalRequest = new Promise((resolve, reject) => {
        refresh.refreshSubscribers.push(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          resolve(axios(originalRequest))
        });
      }).catch(error => console.log(error.message));
      return retryOriginalRequest;
    }
    else {
      console.log('Error code: ', errorStatus)
      return Promise.reject(error)
    }
  })

  return axiosInstance
}

export default useAxios
