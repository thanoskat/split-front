import './App.css';
import { Notifications, UserBar, NavigationBar2, About, Users, User, Login, SignUp, VerifyLink, Profile, MyGroups, PrivateRoute, MainPage } from './components'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { GlobalStateContextProvider } from './contexts/GlobalStateContext'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './semantic-icons.css'
import { useState } from 'react';

function App() {

  return (
    <AuthenticationContextProvider>
      <GlobalStateContextProvider>
        <BrowserRouter>
          <div className="App">
            {/* <NavigationBar/> */}
            <UserBar />
            <NavigationBar2 />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />
              <Route path="/v/:token" component={VerifyLink} />
              <Route path="/signup" component={SignUp} />
              {/* <PrivateRoute exact path="/group/:groupid"component={Group}/> */}
              <PrivateRoute path="/mygroups" component={MyGroups} />
              <PrivateRoute exact path="/users" component={Users} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute path="/user/:id" component={User} />
              <PrivateRoute path="/notifications" component={Notifications} />
              <PrivateRoute path="/main" component={MainPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </GlobalStateContextProvider>
    </AuthenticationContextProvider>
  );
}

const Home = () => (
  <div>
    <h1>Home Page</h1>
  </div>
)

export default App;
