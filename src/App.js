import './App.css';
import {
  Home,
  Menus,
  Main,
  TabExpenses,
  Login,
  VerifyLink,
  VerifyInvitation,
  PrivateRoutes,
  AddExpense2,
  TabMembers,
  TabSettleUp,
  Expenses,
  Home
} from './components'
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
            <Route path='/' element={<Home />} />
            <Route path='i/:invitationCode' element={<VerifyInvitation />} />
            <Route path=':groupid' element={<Main />}>
              <Route index element={<Expenses />} />
              <Route path='expenses' element={<Expenses />} />
              <Route path='members' element={<TabMembers />} />
              <Route path='settleup' element={<TabSettleUp />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Menus/>
    </BrowserRouter>
  )
}

export default App
