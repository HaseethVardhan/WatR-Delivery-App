import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Navbar from "../customComponents/Navbar.jsx";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AddCheck = () => {
  const [addresses, setAddresses] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const [newAddress, setNewAddress] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleAddressInput = async (value) => {
    setNewAddress(value);
    if (value.length > 2) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/address/get-address-suggestions`,
          { input: value },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSuggestions(response.data.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const createNewAddress = async () => {
    console.log(newAddress);
    setLoading(true);
    try {
      // Validate if address is selected
      if (!newAddress) {
        throw new Error("Please enter an address");
      }

      // Find the matching suggestion to get placeId
      const selectedSuggestion = suggestions.find(
        (suggestion) => suggestion.description === newAddress
      );

      if (!selectedSuggestion) {
        throw new Error("Please select an address from the suggestions");
      }

      // Create new address
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/address/create-address`,
        {
          placeString: newAddress,
          placeId: selectedSuggestion.place_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ); 

      if (response.status === 201) {
        const addAddressToUser = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/add-address`,
          {
            addressId: response.data.data.address._id
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAddresses(addAddressToUser.data.data.user.addresses)
        setNewAddress("");
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log(error.message || "Error creating address. Please try again.");
    }
    setLoading(false);
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/address/get-address`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAddresses(response.data.data.addresses);

    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    
    fetchAddresses();
    
  }, [newAddress]);

  const continueHandler = async () => {
    navigate(`/new-subscription-type?address=${selectedAddress}`);
  }


  return (
    <div className="p-4">
      {loading && (
        <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
          Loading...
        </div>
      )}
      <h2 className="text-lg font-semibold mb-4">Select Delivery Address</h2>
      <div className="space-y-4">
        {addresses?.map((address) => (
          <div
            key={address._id}
            onClick={() => setSelectedAddress(address._id)}
            className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-200 ${
              selectedAddress === address._id ? 'relative' : ''
            }`}
          >
            {selectedAddress === address._id && (
              <span className="absolute -top-2 left-2 text-xs bg-white px-1 text-blue-500">
                Selected Address
              </span>
            )}
            <p>{address.placeString}</p>
          </div>
        ))}
        {selectedAddress && (
          <Button 
            className="w-full mt-4 bg-green-500 shadow-none"
            onClick={() => continueHandler()}
          >
            Continue
          </Button>
        )}
        <div className="mb-4">
          <Label htmlFor="address">New Address</Label>
          <Input
            id="address"
            value={newAddress}
            onChange={(e) => handleAddressInput(e.target.value)}
            placeholder="Enter your address"
            className="w-full mt-1"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 border rounded-md shadow-sm">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setNewAddress(suggestion.description);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button className="w-full" onClick={() => {
          createNewAddress()
        }}>
          + Add New Address
        </Button>
      </div>
    </div>
  );
};

export default AddCheck;
