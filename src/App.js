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
  VerifySignInToken,
  VerifySignUpToken,
  ReviewGroups,
} from './components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './semantic-icons.css'


function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* <Route path="/socket" element={<WebSocketTest />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/v/:token" element={<VerifyLink />} />
          <Route path="/si/:token" element={<VerifySignInToken />} />
          <Route path="/su/:token" element={<VerifySignUpToken />} />
          <Route path="/addexp" element={<AddExpense />} />
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

// members tab css !
// settle/transfer in members tab !
// go from group to welcome page !
// visit invitation without account/login !
// loadings !
// try/catch !
// email service !
// user bar !
// sum filtered expenses !
// delete group !

// add member with no account ~!

// LoginOrSignup component fix
// kick a user
// New expense button at bottom
// correct view in desktop mode
