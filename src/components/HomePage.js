import React from 'react'
import { Divider, Segment } from 'semantic-ui-react'
import { Login, Createnewaccount } from '.'
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

         <div className='grid'>
            <div className="Box1">
               Box 1
            </div>
            <div className='containerbox'>
               <div className='loginobject'>
                  <Segment padded basic textAlign='center' id="homepage">
                     <Login />
                     <Divider id="homepagedivider" horizontal>Or</Divider>
                     <Createnewaccount />
                  </Segment>
               </div>
            </div>
         </div>
      </div>
   )
}


{/* <Button
color="green"
content='Create New Account'
onClick={RouteToSignup}
/> */}
export default HomePage;