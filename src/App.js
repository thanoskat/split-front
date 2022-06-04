import './App.css';
import { Menus, Main, TabExpenses, UserBar, Login, SignUp, VerifyLink, Invitation, VerifyInvitation, PrivateRoutes, AddExpense2, TabMembers, TabSettleUp, } from './components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './semantic-icons.css'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        {/* <UserBar/> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/v/:token" element={<VerifyLink />} />
          <Route path="/addexp" element={<AddExpense2 />} />
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<div>Welcome</div>} />
            <Route path='/i/:invitationCode' element={<VerifyInvitation />} />
            <Route path='/:groupid' element={< Main />}>
              <Route path='/:groupid/expenses' element={<TabExpenses />} />
              <Route path='/:groupid/members' element={<TabMembers />} />
              <Route path='/:groupid/settleup' element={<TabSettleUp />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Menus/>
    </BrowserRouter>
  )
}

export default App;
