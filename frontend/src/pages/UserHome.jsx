import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../customComponents/Navbar";
import axios from "axios";
import { Button } from "@/components/ui/button";

const UserHome = () => {
  const [subscriptions, setSubscriptions] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-user-subscriptions`,
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

  const handleCancelSubscription = async (subscriptionId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/subscription/cancel-subscription`,
        {
          subscriptionId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubscriptions(
        subscriptions.filter(
          (subscription) => subscription._id !== subscriptionId
        )
      );
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && (
        <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
          Loading...
        </div>
      )}
      <Navbar />
      <div className="flex justify-center">
      <Button
          onClick={() => {
            navigate("/new-subscription-type");
          }}
          className="bg-green-500 shadow-none "
        >
          New Subscription
        </Button>
      </div>

      <div className="p-4">
        <h1 className="font-black text-xl pb-5">Your Active Subscriptions</h1>
        <div className="grid gap-4">
          {subscriptions?.map((subscription) => (
            <div
              key={subscription._id}
              className="p-4 border rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg capitalize">
                    {subscription.product.productType}
                  </h2>
                  <p className="text-gray-600">
                    {subscription.product.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{subscription.cost}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {subscription.quantity}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Expires:{" "}
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </p>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this subscription? No refunds will be provided."
                      )
                    ) {
                      handleCancelSubscription(subscription._id);
                    }
                  }}
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
