import React from 'react'

const OrderDetailsMin = (props) => {
  return (
    <div className='flex flex-col border-2 border-gray-100 rounded-lg p-4 my-2'>
      <div className='flex flex-col'>
        <p className='font-semibold'>{props.subscription.quantity} Water {props.subscription.product.productType}</p>
        <p className=''>{props.subscription.address.placeString}</p>
      </div>
    </div>
  )
}

export default OrderDetailsMin