import React from 'react'
import { Button } from "@/components/ui/button"
import {Link} from 'react-router-dom'


const Navbar = () => {

  return (
    <div className=' py-4 flex justify-between items-center'>
        <div className='font-sans font-bold px-3 text-xl flex justify-center items-center'>
            Watr
        </div>
        <div className=' flex items-center px-2'>
        <Link to='/user-home'>
          <Button variant="link" className='text-xs w-12 font-semibold'>User</Button>
        </Link>
        <Link to='/supplier-home'>
          <Button variant="link" className='text-xs w-12 font-semibold'>Supplier</Button>
        </Link>
        </div>
    </div>
  )
}

export default Navbar