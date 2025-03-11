import React from 'react'
// import { useNavigate } from "react-router-dom";
import Navbar from "../customComponents/Navbar.jsx";
// import OrderDetailsMin from "../customComponents/OrderDetailsMin.jsx";
import axios from "axios";
// import { Button } from "@/components/ui/button.jsx";

const SupplierCustomers = () => {

    const [subscriptions, setSubscriptions] = React.useState();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchSubscriptions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/supplier/get-customers`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setSubscriptions(response.data.data);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
            setLoading(false);
        };

        fetchSubscriptions();
    }, []);

  return (
    <div>
    {loading && (
      <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
        Loading...
      </div>
    )}
    <Navbar />
    <div className="p-4">
      <h1 className="font-black text-xl pb-5">Active Customers</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions?.map((subscription, index) => (
            <div key={index} className="p-4 border rounded-lg shadow">
                <h2 className="font-bold text-lg">{subscription.customerInfo.username.firstname+" "+subscription.customerInfo.username.lastname}</h2>
                <p className="text-gray-600">{subscription.customerInfo.email}</p>
                <p className="text-gray-600">{subscription.customerInfo.phone}</p>
                <div className="mt-3">
                    <h3 className="font-semibold">Subscriptions:</h3>
                    <div className="space-y-2">
                        {subscription.subscriptions.map((sub, index) => (
                            <div key={index} className="pl-2">
                                <p>Product: {sub.product.productType}</p>
                                <p>Quantity: {sub.quantity} {sub.product.unit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
    </div>
    </div>
  )
}

export default SupplierCustomers