import './App.css';
import {
  Home,
  Main,
  VerifyInvitation,
  PrivateRoutes,
  TabMembers,
  Expenses,
  VerifyToken,
  ReviewGroups,
  SignIn,
  SignUp,
  Continue,
  RecordPayment,
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
            {/* <Route index element={<Expenses />} /> */}
            <Route path='expenses' element={<Expenses />} />
            <Route path='members' element={<TabMembers />} />
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
// [X] transfer !!
// [ ] css on create group submit same size as other submit buttons
// [ ] get distribution response for expenses from DB
// [ ] validator for record tranfer
// [X] add guest member Kristie(Guest) !!
// [X] expense details: participants, isEqually && participation !!
// [ ] number of people participating in expense to be fixed so that if doesn't overlap with scale or be out of screen
// [ ] automatic copy of invitation link
// [ ] expense EDIT !!
// [/] members tab css / settle in members tab !
// [ ] bring equal distributed amount from back end instead of re calculating in front.
// [ ] user bar !
// [X] single + button for expense/transfer/member ? !
// [X] create new group focus on group name input field
// [ ] currency conversion
// [ ] profile button on top right to show more rather than logging you out instantly
// [ ]
// [ ] expense unequal split amount addition per name UX ??
// [ ] /62c40a27e252e8ca01293e1f/review
// [ ] visit invitation without account/login
// [ ] delete group
// [ ] kick a user
// [ ] correct view in desktop mode
//
