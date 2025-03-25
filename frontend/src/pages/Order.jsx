import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../customComponents/Navbar'
import axios from 'axios'
import { Button } from '@/components/ui/button'

const Order = () => {
const [searchParams] = useSearchParams();
const productId = searchParams.get('productId');
const addressId = searchParams.get('addressId');

const navigate = useNavigate();

const [product, setProduct] = React.useState(null);
const [address, setAddress] = React.useState(null);
const [quantity, setQuantity] = React.useState(0);
const [loading, setLoading] = React.useState(true);
const [error, setError] = React.useState("");

const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString();
const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

React.useEffect(() => {
    const fetchData = async () => {
        try {
            const [productResponse, addressResponse] = await Promise.all([
                axios.post(`${import.meta.env.VITE_BASE_URL}/product/get-product`, {
                    productId
                },{
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    
                }),
                axios.post(`${import.meta.env.VITE_BASE_URL}/address/get-plain-address`, 
                {
                    addressId 
                }
                ,{
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                })
            ]);

            setProduct(productResponse.data.data.product);
            const foundAddress = addressResponse.data.data.address;
            setAddress(foundAddress);
            setQuantity(productResponse.data.data.product.minimumOrderQuantity);
        } catch (error) {
            setError("Failed to fetch data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [productId, addressId]);


const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= product.minimumOrderQuantity) {
        setQuantity(value);
    }
};

const handleConfirmOrder = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/subscription/new-subscription`,
            {
                productId,
                quantity,
                addressId
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }
        );
        
        if (response.status === 201) {
            navigate('/user-home');
        }
    } catch (error) {
        setError("Failed to create subscription");
        console.error(error);
    }
};

if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
}

if (error) {
    return (<>
    <Navbar />
    <div className="text-red-500 text-center">{error}</div>
    </>)
}

return (
    <>
    <Navbar />
    <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        
        {product && (
            <div className="space-y-6">
                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{product.description}</h2>
                    <p className="text-gray-600">Type: {product.productType}</p>
                    <p className="text-gray-600">Price per unit: ₹{product.cost}</p>
                    <p className="text-gray-600">Supplier: {product.supplierId.suppliername}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Delivery Address</h3>
                    <p>{address?.placeString}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Subscription Period</h3>
                    <p>Start Date: {startDate}</p>
                    <p>End Date: {endDate}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Quantity per day</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => quantity > product.minimumOrderQuantity && setQuantity(quantity - 1)}
                            className="px-3 py-1"
                        >
                            -
                        </Button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min={product.minimumOrderQuantity}
                            className="w-20 text-center border rounded p-1"
                        />
                        <Button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1"
                        >
                            +
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Minimum order: {product.minimumOrderQuantity}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Total Cost</h3>
                    <p className="text-xl">₹{product.cost * quantity * 30}</p>
                    <p className="text-sm text-gray-500">For 30 days</p>
                </div>

                <Button
                    onClick={handleConfirmOrder}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                    Confirm your order
                </Button>
            </div>
        )}
    </div>
    </>
);
}

export default Order