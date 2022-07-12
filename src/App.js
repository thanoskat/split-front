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
// [x] user bar !
// [/] loadings !
// [/] try/catch !
// [ ] members tab css !
// [ ] New expense button at bottom!
// [ ] settle/transfer in members tab !
// [ ] go from group to welcome page !
// [ ] visit invitation without account/login !
// [ ] sum filtered expenses !
// [ ] delete group !
//
// [ ] add member with no account ~!
//
// [x] LoginOrSignup component fix
// [ ] kick a user
// [ ] correct view in desktop mode
