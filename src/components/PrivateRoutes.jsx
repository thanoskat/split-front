import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const accessToken = useSelector((state) => state.authReducer.accessToken)
  return(
    accessToken ? <Outlet/> : <Navigate to='/signin'/>
  )
}

export default PrivateRoutes