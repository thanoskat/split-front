import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  // const location = useLocation()
  const accessToken = useSelector((state) => state.authReducer.accessToken)
  return(
    accessToken ? <Outlet/> : <Navigate to="/login"/>
  )
}

export default PrivateRoutes