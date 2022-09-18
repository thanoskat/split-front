import './App.css'
import './semantic-icons.css'
import {
  Transfers,
  RedirectToExpenses,
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
  BreakDown
} from './components'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const [initialPath, setInitialPath] = useState(location.pathname)

  useEffect(() => {
    document.title = 'αSplit'
  })

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/continue" element={<Continue initialPath={initialPath} setInitialPath={setInitialPath} />} />
      <Route path="/s/:token" element={<VerifyToken />} />
      <Route element={<PrivateRoutes />}>
        <Route path='/' element={<Home />} />
        <Route path='i/:invitationCode' element={<VerifyInvitation setInitialPath={setInitialPath} />} />
        <Route path ='i/:invitationCode/review' element={<ReviewGroups/>}/>
        <Route path=':groupid' element={<Main />}>
          <Route index element={<RedirectToExpenses />} />
          <Route path='expenses' element={<Expenses />} />
          <Route path='transfers' element={<Transfers />} />
          <Route path='members' element={<TabMembers />} />
          <Route path='*' element={<RedirectToExpenses />} />
        </Route>
      </Route>
    </Routes>
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

// allow option to show expenses only user is involved in
// tags should be filtered easier (e.g. search bar or list)
// total spent fix with actual spent. Allow breakdown option
// replace user's name with You and have it checked
// add percentages, shares in unequal split
// add calculator in unequal split
// allow multiple spenders for one expense


// [X] transfer !!
// [X] css on create group submit same size as other submit buttons
// [ ] get distribution response for expenses from DB
// [X] validator for record tranfer
// [X] add guest member Kristie(Guest) !!
// [X] expense details: participants, isEqually && participation !!
// [ ] number of people participating in expense to be fixed so that if doesn't overlap with scale or be out of screen (minor)
// [ ] automatic copy of invitation link
// [ ] expense EDIT !!
// [/] members tab css / settle in members tab !
// [ ] bring equal distributed amount from back end instead of re calculating in front.
// [ ] user bar !
// [X] single + button for expense/transfer/member ? !
// [X] create new group focus on group name input field
// [ ] currency conversion
// [ ] profile button on top logs off automatically?
// [ ] expense unequal split amount addition per name UX ??
// [ ] /62c40a27e252e8ca01293e1f/review
// [ ] visit invitation without account/login
// [ ] delete group
// [ ] kick a user
// [ ] correct view in desktop mode
//
