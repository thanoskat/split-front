import '../style/Login.css'
import {LoginOrSignup,SignUp} from "."
import {useLocation} from 'react-router-dom'


const Login = () => {

  const location = useLocation()
  console.log(location)
  return (
    <div id="loginpage" className=' flex column ' style={{ color: "var(--light-color)" }}>
      <div className='logo t66 flex alignitems-center'>
        α
      </div>
      <div className='appName flex column alignitems-center t05'>
        αlphaSplit
        <div className='appDescr t5'>
          The tool for organising your shared finances.
        </div>
      </div>
      {location.pathname === '/login'?<LoginOrSignup /> : location.pathname==='/signup'? <SignUp/> :'' }
    </div>
  );
}

export default Login;


