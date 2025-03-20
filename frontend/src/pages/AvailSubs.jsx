import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../customComponents/Navbar'

const AvailSubs = () => {

  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const address = searchParams.get('address')
    
    

  return (
    <div>
      <Navbar />
    </div>
  )
}

export default AvailSubs