import './App.css';
import { Menus, FigmaMain, TabExpenses, UserBar, Login, SignUp, VerifyLink, Invitation, VerifyInvitation, PrivateRoutes, AddExpense2, TabMembers, TabSettleUp, } from './components'
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
            <Route path='/i/:invitationCode' element={<VerifyInvitation />} />
            <Route path='/' element={<FigmaMain />}>
              <Route path='/expenses' element={<TabExpenses />} />
              <Route path='/members' element={<TabMembers />} />
              <Route path='/settleup' element={<TabSettleUp />} />
              <Route exact ='/expenses/new' element={<AddExpense2 />} />
              <Route path='/*/invitation' element={<Invitation />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Menus/>
    </BrowserRouter>
  )
}

export default App;
