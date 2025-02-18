import React from 'react'
import Navbar from '../customComponents/Navbar.jsx'
import OrderDetailsMin from '../customComponents/OrderDetailsMin.jsx'

const SupplierHome = () => {
  return (
    <div>
      <Navbar />
      <h1 className='font-bold text-lg p-3'>Today's Deliveries</h1>
      <div className='w-screen flex justify-center'>
        < OrderDetailsMin />
      </div>
    </div>
  )
}

export default SupplierHome