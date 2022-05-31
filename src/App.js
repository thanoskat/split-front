import './App.css';
import { Menus, FigmaMain, UserBar, Login, SignUp, VerifyLink, VerifyInvitation, PrivateRoute, AddExpense2 } from './components'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './semantic-icons.css'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        {/* <UserBar/> */}
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/v/:token" component={VerifyLink}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/addexp" component={AddExpense2}/>
            <PrivateRoute path="/i/:invitationCode" component={VerifyInvitation}/>
            <PrivateRoute path="/" component={FigmaMain}/>
          </Switch>
      </div>
      <Menus/>
    </BrowserRouter>
  )
}

export default App;
