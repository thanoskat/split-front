import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthenticationContext } from './AuthenticationContext'

const PrivateRoute = ({ component: Component, ...rest }) => {

  const { accessToken } = useContext(AuthenticationContext);
    
  return(
    <Route {...rest} render={ (props) => {
      console.log("PRIVATEROUTE ACCESSTOKENCHECK: ", accessToken)
      if (accessToken){
        return <Component {...props} />;
      } else {
        return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
      }
    }} />
  )
}

export default PrivateRoute
