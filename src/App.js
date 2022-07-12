import './App.css';
import {
  Home,
  Main,
  Login,
  VerifyLink,
  VerifyInvitation,
  PrivateRoutes,
  AddExpense,
  TabMembers,
  TabSettleUp,
  Expenses,
  VerifyToken,
  VerifySignInToken,
  VerifySignUpToken,
  ReviewGroups,
  SignIn,
  SignUp,
  Continue,
} from './components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './semantic-icons.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* <Route path="/socket" element={<WebSocketTest />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/signup" element={<Login />} /> */}
          {/* <Route path="/v/:token" element={<VerifyLink />} /> */}
          {/* <Route path="/si/:token" element={<VerifySignInToken />} /> */}
          {/* <Route path="/su/:token" element={<VerifySignUpToken />} /> */}
          {/* <Route path="/addexp" element={<AddExpense />} /> */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/continue" element={<Continue />} />
          <Route path="/s/:token" element={<VerifyToken />} />
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<Home />} />
            <Route path='i/:invitationCode' element={<VerifyInvitation />} />
            <Route path ='i/:invitationCode/review' element={<ReviewGroups/>}/>
            <Route path=':groupid' element={<Main />}>
              <Route index element={<Expenses />} />
              <Route path='expenses' element={<Expenses />} />
              <Route path='members' element={<TabMembers />} />
              <Route path='settleup' element={<TabSettleUp />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
// TODO
// [x] email service !
// [x] LoginOrSignup component fix
// [/] loadings !!
// [/] try/catch !!
//
// [ ] [BUG] description overflows over amount !
// [ ] [BUG] can't refresh in mobile browser with gesture !
// [ ] [BUG] go from group to home page !
// [ ] [BUG] sum filtered expenses !
//
// [ ] transfer !!
// [ ] add guest member Kristie(Guest) !!
// [ ] expense details: participants, isEqually && participation !!
// [ ] expense EDIT !!
// [/] members tab css / settle in members tab !
//
// [ ] user bar !
// [ ] single + button for expense/transfer/member ? !
// [ ] create new group focus on group name input field
// [ ] currency conversion
// [ ]
// [ ] expense unequal split amount addition per name UX ??
// [ ] /62c40a27e252e8ca01293e1f/review
// [ ] visit invitation without account/login
// [ ] delete group
// [ ] kick a user
// [ ] correct view in desktop mode
//
