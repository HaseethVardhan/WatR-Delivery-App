import React from 'react'
import axios from 'axios'
import Navbar from "../customComponents/Navbar.jsx";


const SupplierViewProducts = () => {
    const [loading, setLoading] = React.useState(false);

    const [products, setProducts] = React.useState();

    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/product/view-products`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setProducts(response.data.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [])


  return (
    <div>
        {loading && (
        <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
          Loading...
        </div>
      )}
      <Navbar />
    <div className="flex flex-col p-4">
        <h1 className="font-black text-xl pb-5">Your Subscription Models</h1>
        <div className="grid gap-4">
            {products?.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't created any subscription models yet</p>
                    
                </div>
            )}
            {products?.map((product) => (
                <div 
                    key={product._id}
                    className="border rounded-lg p-4 shadow-sm"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold capitalize">
                                {product.productType}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {product.description}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">₹{product.cost}/unit</p>
                            <p className="text-sm text-gray-500">
                                MOQ: {product.minimumOrderQuantity}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        Quantity per unit: {product.quantity} L
                    </div>
                </div>
            ))}
        </div>
    </div>
    </div>
  )
}

export default SupplierViewProducts