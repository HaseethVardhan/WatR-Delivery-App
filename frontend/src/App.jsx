import Intro from './pages/Intro.jsx'
import UserLogin from './pages/UserLogin.jsx'
import SupplierLogin from './pages/SupplierLogin.jsx'
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx'
import SupplierProtectedWrapper from './pages/SupplierProtectedWrapper.jsx'
import SupplierRegister from './pages/SupplierRegister.jsx'
import UserRegister from './pages/UserRegister.jsx'
import UserHome from './pages/UserHome.jsx'
import SupplierHome from './pages/SupplierHome.jsx'
import { Routes, Route } from 'react-router-dom'
import SupplierNewProduct from './pages/SupplierNewProduct.jsx'
import SupplierViewProducts from './pages/SupplierViewProducts.jsx'
import SupplierCustomers from './pages/SupplierCustomers.jsx'
import NewSubType from './pages/NewSubType.jsx'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/supplier-login' element={<SupplierLogin />} />
        <Route path='/register' element={<UserRegister />} />
        <Route path='/supplier-register' element={<SupplierRegister />} />
        <Route path='/user-home' element={
          <UserProtectedWrapper>
            <UserHome />
          </UserProtectedWrapper>
        } />
        <Route path='/new-subscription-type' element={
          <UserProtectedWrapper>
            <NewSubType />
          </UserProtectedWrapper>
        } />
        <Route path='/supplier-home' element={
          <SupplierProtectedWrapper>
            <SupplierHome />
          </SupplierProtectedWrapper>
        } />
        <Route path='/supplier-create-subscription-model' element={
          <SupplierProtectedWrapper>
            <SupplierNewProduct />
          </SupplierProtectedWrapper>
        } />
        <Route path='/supplier-view-subscription-model' element={
          <SupplierProtectedWrapper>
            <SupplierViewProducts />
          </SupplierProtectedWrapper>
        } />
        <Route path='/supplier-view-customers' element={
          <SupplierProtectedWrapper>
            <SupplierCustomers />
          </SupplierProtectedWrapper>
        } />
      </Routes>
    </>
  )
}

export default App
