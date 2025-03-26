import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../customComponents/Navbar.jsx";
import OrderDetailsMin from "../customComponents/OrderDetailsMin.jsx";
import axios from "axios";
import { Button } from "@/components/ui/button.jsx";

const SupplierHome = () => {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = React.useState();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/supplier/get-subscriptions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSubscriptions(response.data.data.subscriptions);
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
      <div className="flex flex-col max-w-[500px] w-[100%] justify-self-center p-3 gap-2">
        <Button
          onClick={() => {
            navigate("/supplier-create-subscription-model");
          }}
          className="bg-green-500 shadow-none"
        >
          New Subscription Model
        </Button>
        <Button
          onClick={() => {
            navigate("/supplier-view-subscription-model");
          }}
          className="shadow-none"
          variant="secondary"
        >
          View All Subscription Models
        </Button>
        <Button
          onClick={() => {
            navigate("/supplier-view-customers");
          }}
          className="shadow-none"
          variant="secondary"
        >
          View Customers
        </Button>
      </div>
      <h1 className="font-bold text-lg p-3">Today's Deliveries</h1>
      <div className="flex flex-col justify-center p-3 ">
        {subscriptions?.length === 0 && (
          <div className="text-gray-500 text-center">No deliveries today</div>
        )}
        {subscriptions !== undefined &&
          subscriptions.map((subscription) => (
            <div key={subscription._id}>
              <OrderDetailsMin subscription={subscription} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SupplierHome;
