import React from 'react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../customComponents/Navbar'

const NewSubType = () => {

        const navigate = useNavigate()
        const [searchParams] = useSearchParams();
        const address = searchParams.get('address');
    

        const [subType, setSubType] = useState('')
        const [loading, setLoading] = React.useState(false);


        const handleClick = (type) => {
                setLoading(true)
                setSubType(type)
                if (subType) {
                        navigate(`/available-products?type=${subType}&address=${address}`)
                }
                setLoading(false)
        }

return (
    <div>
        {loading && (
        <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
          Loading...
        </div>
      )}
        <Navbar />
        <div className='flex flex-col '>    
        <div 
                    className="bg-blue-500 p-10 m-2.5 cursor-pointer text-white rounded-md flex justify-center font-bold"
                    onClick={() => handleClick('can')}
            >
                    Water Can
            </div>
            <div 
                    className="bg-blue-500 p-10 m-2.5 cursor-pointer text-white rounded-md flex justify-center font-bold"
                    onClick={() => handleClick('bottle')}
            >
                    Water Bottle
            </div>
            <div 
                    className="bg-blue-500 p-10 m-2.5 cursor-pointer text-white rounded-md flex justify-center font-bold"
                    onClick={() => handleClick('packet')}
            >
                    Water Packet
            </div>
        </div>
        
    </div>
)
}

export default NewSubType