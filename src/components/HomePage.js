import React from 'react'
import { Divider, Segment } from 'semantic-ui-react'
import {Login,Createnewaccount} from '.'
import { useHistory } from 'react-router-dom'
import './homepage.css'


 function HomePage() {

    // const history = useHistory(); //this is used to re-route usign a button
    // const RouteToSignup=()=>{

    //     let path = `/signup`; 
    //     history.push(path);

    // }

    return (
     <div>
        <Segment basic textAlign='center' id="homepage">
            <Login/>
         <Divider id="homepagedivider" horizontal>Or</Divider>
         <Createnewaccount/>
        </Segment>
     </div>  
    )
}


{/* <Button
color="green"
content='Create New Account'
onClick={RouteToSignup}
/> */}
export default HomePage;