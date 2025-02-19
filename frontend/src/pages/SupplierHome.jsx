import React from "react";
import Navbar from "../customComponents/Navbar.jsx";
import OrderDetailsMin from "../customComponents/OrderDetailsMin.jsx";
import axios from 'axios'

const SupplierHome = () => {
  const [subscriptions, setSubscriptions] = React.useState();

const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/supplier/get-subscriptions`, {
          headers: {
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        });

        setSubscriptions(response.data.data.subscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
      setLoading(false)
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
      <h1 className="font-bold text-lg p-3">Today's Deliveries</h1>
      <div className="flex flex-col justify-center p-3">

        {subscriptions!== undefined  && subscriptions.map((subscription) => (
          <div key={subscription._id}>
            <OrderDetailsMin subscription={subscription} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierHome;
