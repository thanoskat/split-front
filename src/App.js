import './App.css';
import { NavigationBar, About, Users, User, Login, SignUp, VerifyLink, Profile, MyGroups, Group, PrivateRoute, HomePage, MainPage } from './components'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'



function App() {
  return (
    <AuthenticationContextProvider>
      <BrowserRouter>
        <NavigationBar />
        <div className="App">
          <Switch>

            <Route path="/main" component={MainPage} />
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={Login} />
            <Route path="/about" component={About} />
            <Route path="/v/:token" component={VerifyLink} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute exact path="/group/:groupid" component={Group} />
            <PrivateRoute exact path="/mygroups" component={MyGroups} />
            <PrivateRoute exact path="/users" component={Users} />
            <PrivateRoute path="/users/:id" component={User} />
            <PrivateRoute exact path="/profile" component={Profile} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthenticationContextProvider>
  );
}


export default App;
