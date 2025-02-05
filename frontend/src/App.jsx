import Intro from './pages/Intro.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx'
import UserRegister from './pages/UserRegister.jsx'
import UserHome from './pages/UserHome.jsx'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/register' element={<UserRegister />} />
        <Route path='/user-home' element={
          <UserProtectedWrapper>
            <UserHome />
          </UserProtectedWrapper>
        } />
      </Routes>
    </>
  )
}

export default App
