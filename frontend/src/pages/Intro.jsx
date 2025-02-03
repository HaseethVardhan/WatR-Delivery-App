import React from 'react'
import Navbar from '../customComponents/Navbar.jsx'
import{Button} from '@/components/ui/button.jsx'

const Intro = () => {
  return (
    <div>
        <Navbar />
        <div className='relative'>
          <img src="https://media.istockphoto.com/id/1193333115/photo/plastic-bottles-of-natural-spring-water.jpg?s=612x612&w=0&k=20&c=9hWvVryq704WMnn0USZ61k5NmTIZOz2wUVB8ng8sbHQ=" className='w-screen'/>
          <div className='absolute bottom-2 left-3'>
            <h1 className='text-white font-sans text-3xl font-black'>Drinking water,</h1>
            <h1 className='text-white font-sans text-3xl font-black'>delivered</h1>
            <p className='text-white text-xs py-3'>Get your first month free. Cancel anytime.</p>
            <Button className='bg-[#2180DE] font-sans rounded-xl text-sm font-semibold'>Start now</Button>
          </div>
        </div>
        
    </div>
  )
}

export default Intro