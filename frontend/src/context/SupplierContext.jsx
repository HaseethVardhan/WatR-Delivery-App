import React, { createContext, useState } from 'react'

export const SupplierDataContext = createContext()

const SupplierContext = ({children}) => {

    const [supplier, setsupplier] = useState({})

  return (
    <div>
        <SupplierDataContext.Provider value={{supplier, setsupplier}}>
            {children}
        </SupplierDataContext.Provider>
    </div>
  )
}

export default SupplierContext