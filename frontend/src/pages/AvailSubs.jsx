import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../customComponents/Navbar'
import axios from 'axios'

const AvailSubs = () => {

  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const address = searchParams.get('address')

  const [products, setProducts] = React.useState();

  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/product/get-products-available`,
          {
            type: type,
            addressId: address 
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
  
        if (response.status === 200) {
          setProducts(response.data.data.products);
        }
      } catch (error) {
        console.error("Error fetching available products:", error);
      }
    }

    getProducts()
  })
    
    

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        {products ? (
          products.length > 0 ? (
            <div className="row">
              {products.map((product) => (
                <div key={product._id} className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">Price: ${product.price}</p>
                      <p className="card-text">Type: {product.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No search results appear</p>
          )
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  )
}

export default AvailSubs