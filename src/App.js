import './App.css';
import { Nav, About, Users, User, Login, SignUp, VerifyLink, Profile, MyGroups, Group, PrivateRoute } from './components'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (
    <AuthenticationContextProvider>
      <BrowserRouter>
        <div className="App">
          <Nav/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/about" component={About}/>
            <Route path="/v/:token" component={VerifyLink}/>
            <Route path="/signup" component={SignUp}/>
            <PrivateRoute exact path="/group/:groupid"component={Group}/>
            <PrivateRoute exact path="/mygroups" component={MyGroups}/>
            <PrivateRoute exact path="/users" component={Users}/>
            <PrivateRoute exact path="/profile" component={Profile}/>
            <PrivateRoute path="/user/:id" component={User}/>
          </Switch>
        </div>
      </BrowserRouter>
    </AuthenticationContextProvider>
  );
}

const Home = () => (
  <div>
    <h1>Home Page</h1>
  </div>
)

export default App;
