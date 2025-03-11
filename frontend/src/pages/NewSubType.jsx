import React from 'react'
import Navbar from '../customComponents/Navbar'

const NewSubType = () => {
return (
    <div>
        <Navbar />
        <div className='flex flex-col '>    
        <div 
                    className="bg-blue-500 p-10 m-2.5 cursor-pointer text-white rounded-md flex justify-center font-bold"
                    onClick={() => console.log('Water Can clicked')}
            >
                    Water Can
            </div>
            <div 
                    className="bg-blue-500 p-10 m-2.5 cursor-pointer text-white rounded-md flex justify-center font-bold"
                    onClick={() => console.log('Water Bottle clicked')}
            >
                    Water Bottle
            </div>
            <div 
                    className="bg-blue-500 p-10 m-2.5 cursor-pointer text-white rounded-md flex justify-center font-bold"
                    onClick={() => console.log('Water Packet clicked')}
            >
                    Water Packet
            </div>
        </div>
        
    </div>
)
}

export default NewSubType