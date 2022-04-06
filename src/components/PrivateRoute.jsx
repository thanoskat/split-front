import { Route, Redirect } from 'react-router-dom'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ component: Component, ...rest }) => {

  // const { accessToken } = useContext(AuthenticationContext);
  const accessToken = useSelector((state) => state.authReducer.accessToken)

  return(
    <Route {...rest} render={ (props) => {
      // console.log("PRIVATEROUTE ACCESSTOKENCHECK: ", accessToken)
      if (accessToken){
        return <Component {...props} />;
      } else {
        return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
      }
    }} />
  )
}

export default PrivateRoute
