import React from 'react'
import { Button } from "@/components/ui/button"

const Navbar = () => {
  return (
    <div className=' py-4 flex justify-between items-center'>
        <div className='font-sans font-bold px-3 text-xl flex justify-center items-center'>
            Watr
        </div>
        <div className=' flex items-center px-2'>
        <Button variant="link" className='text-xs w-12 font-semibold'>User</Button>
        <Button variant="link" className='text-xs w-12 font-semibold'>Supplier</Button>
        </div>
    </div>
  )
}

export default Navbar