import './App.css';
import {
  Home,
  Main,
  VerifyInvitation,
  PrivateRoutes,
  TabMembers,
  TabSettleUp,
  Expenses,
  VerifyToken,
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
      <Routes>
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
// [x] [BUG] description overflows over amount !
// [x] [BUG] can't refresh in mobile browser with gesture !
// [x] [BUG] go from group to home page !
// [x] [BUG] sum filtered expenses !
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
