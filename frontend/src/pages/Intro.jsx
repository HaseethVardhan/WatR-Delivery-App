import React from 'react'
import {Link} from 'react-router-dom'
import Navbar from '../customComponents/Navbar.jsx'
import{Button} from '@/components/ui/button.jsx'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Intro = () => {
  return (
    <div>
        <Navbar />
        <div className='relative'>
          <img src="https://media.istockphoto.com/id/1193333115/photo/plastic-bottles-of-natural-spring-water.jpg?s=612x612&w=0&k=20&c=9hWvVryq704WMnn0USZ61k5NmTIZOz2wUVB8ng8sbHQ=" className='w-screen max-h-[300px]'/>
          <div className='absolute bottom-2 left-3'>
            <h1 className='text-white font-sans text-3xl font-black'>Drinking water,</h1>
            <h1 className='text-white font-sans text-3xl font-black'>delivered</h1>
            <p className='text-white text-xs py-3'>One place to manage all your water needs.</p>
            <Link to='/user-home'>
              <Button className='bg-[#2180DE] font-sans rounded-xl text-sm font-semibold'>Start now</Button>
            </Link>
          </div>
          
        </div>
        <div className='flex justify-evenly flex-wrap mt-5'>
          <Card className='w-[50%]  max-w-[175px] shadow-inherit rounded-2xl mt-2'>
            <CardHeader className='py-5'>
            <i className="ri-truck-line text-xl"></i>
              <CardTitle className='font-bold text-lg '>Free Delivery</CardTitle>
              <CardDescription className=''>Fast and free delivery</CardDescription>
            </CardHeader>
          </Card>

          <Card className='w-[50%]  max-w-[175px] shadow-inherit rounded-2xl mt-2'>
            <CardHeader className='py-5'>
            <i className="ri-leaf-line text-xl"></i>
              <CardTitle className='font-bold text-lg '>Fresh Water</CardTitle>
              <CardDescription className=''>Fresh Drinking Water</CardDescription>
            </CardHeader>
          </Card>

          <Card className='w-[50%]  max-w-[175px] shadow-inherit rounded-2xl mt-2'>
            <CardHeader className='py-5'>
            <i className="ri-time-line text-xl"></i>
              <CardTitle className='font-bold text-lg '>Subscribe Easy</CardTitle>
              <CardDescription className=''>Subscription process made easy</CardDescription>
            </CardHeader>
          </Card>

          <Card className='w-[50%]  max-w-[175px] shadow-inherit rounded-2xl mt-2'>
            <CardHeader className='py-5'>
            <i className="ri-wallet-line text-xl"></i>
              <CardTitle className='font-bold text-lg '>Pocket Friendly</CardTitle>
              <CardDescription className=''>Best price at one place</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className='flex justify-center py-10'>
        <Link to='/supplier-home'>
          <Button variant='secondary' className='w-screen max-w-[360px] h-[50px] font-bold rounded-lg bg-gray-100'>Become a supplier</Button>
        </Link>
        </div>
        <div className='flex justify-center'>
        <p className='text-gray-400 mb-6'>© 2025 Watr. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Intro