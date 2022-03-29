import './App.css';
import { FigmaMain, MainTest, Group, Test, Notifications, UserBar, NavigationBar2, About, Users, User, Login, SignUp, VerifyLink, Profile, MyGroups, PrivateRoute, MainPage,MyGroupsCreateGroup } from './components'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { GlobalStateContextProvider } from './contexts/GlobalStateContext'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SlidingBoxContextProvider } from './contexts/SlidingBoxContext'
import './semantic-icons.css'

function App() {

  const pathname = window.location.pathname
  console.log(pathname)

  return (
    <AuthenticationContextProvider>
      <GlobalStateContextProvider>
        <BrowserRouter>
          <div className="App">
            {/* <UserBar/> */}
            <NavigationBar2/>
            <SlidingBoxContextProvider>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/about" component={About} />
                <Route path="/v/:token" component={VerifyLink} />
                <Route path="/signup" component={SignUp} />
                {/* <PrivateRoute exact path="/group/:groupid"component={Group}/> */}
                <PrivateRoute path="/figmamain" component={FigmaMain} />
                <PrivateRoute path="/mygroups" component={MyGroups} />
                <PrivateRoute path="/group/:groupid" component={Group} />
                <PrivateRoute exact path="/test" component={Test}/>
                <PrivateRoute exact path="/maintest" component={MainTest}/>
                <PrivateRoute exact path="/users" component={Users} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute path="/user/:id" component={User} />
                <PrivateRoute path="/notifications" component={Notifications} />
                <PrivateRoute path="/main" component={MainPage} />
                <PrivateRoute exact path="/mygroups/creategroup" component={MyGroupsCreateGroup }/>
              </Switch>
            </SlidingBoxContextProvider>
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
