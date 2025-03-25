import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../customComponents/Navbar'
import axios from 'axios'
import { Button } from '@/components/ui/button'

const AvailSubs = () => {

  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const address = searchParams.get('address')

  const navigate = useNavigate()

  const [products, setProducts] = React.useState();
  React.useEffect(() => {
    const fetchProducts = async () => {
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
    };

    fetchProducts();
  }, [])

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
                    <div className="card-body flex-column p-4">
                      <h5 className="card-title font-black text-transform: uppercase">{product.supplierId.suppliername}</h5>
                      {/* <p className="card-text text-transform: capitalize font-semibold">{product.productType}</p> */}
                      <p className="card-text font-thin">{product.description}</p>
                      <p className="card-text font-semibold">Price: ₹{product.cost} per {product.productType}</p>
                      <p className="card-text font-semibold">Quantity: {product.quantity} litres/{product.productType}</p>
                      <p className="card-text font-semibold">Minimum Order: {product.minimumOrderQuantity}</p>
                      <Button 
                        onClick={() => navigate(`/order?productId=${product._id}&addressId=${address}`)}
                        className="bg-green-500 shadow-none w-full mt-3"
                      >
                        Buy Now
                      </Button>
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