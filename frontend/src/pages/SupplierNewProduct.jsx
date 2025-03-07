import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "../customComponents/Navbar.jsx";
import { Button } from "@/components/ui/button.jsx";
import axios from 'axios';


const SupplierNewProduct = () => {
    const [type, setType] = React.useState("");
    const [description, setDescription] = React.useState("");  
    const [moq, setMoq] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [cost, setCost] = React.useState("");

    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/product/create`,
                {
                type,
                description,
                moq,
                quantity,
                cost,
                },
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                }
            );
            
            if(response.status === 201){
                navigate('/supplier-view-subscription-model');
            }
        } catch (error) {
            alert("Error creating product");
            navigate('/supplier-home')
        }
        setLoading(false);
    }
  return (
    <div>
        {loading && (
        <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
          Loading...
        </div>
      )}
        <Navbar />
        <div className="w-screen flex flex-col justify-center items-center">
          <h1 className="font-black text-xl py-5">Create New Product</h1>
          <div className="w-[80%] max-w-[500px] flex flex-col">
            <label htmlFor="type" className="py-2 px-2 font-semibold italic">
            Product Type
            </label>
            <select
            id="type"
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
            onChange={(e) => setType(e.target.value)}
            >
            <option value="">Select type</option>
            <option value="can">Can</option>
            <option value="bottle">Bottle</option>
            <option value="packet">Packet</option>
            </select>

            <label htmlFor="description" className="py-2 px-2 font-semibold italic">
            Description
            </label>
            <input
            type="text"
            id="description"
            placeholder="Enter product description"
            className="shadow-none text-sm h-[45px]"
            onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="moq" className="py-2 px-2 font-semibold italic">
            Minimum Order Quantity
            </label>
            <input
            type="number"
            id="moq"
            placeholder="Enter minimum order quantity"
            className="shadow-none text-sm h-[45px]"
            onChange={(e) => setMoq(e.target.value)}
            />

            <label htmlFor="quantity" className="py-2 px-2 font-semibold italic">
            Quantity in Litres per unit
            </label>
            <input
            type="number"
            id="quantity"
            placeholder="Enter available quantity"
            className="shadow-none text-sm h-[45px]"
            onChange={(e) => setQuantity(e.target.value)}
            />

            <label htmlFor="cost" className="py-2 px-2 font-semibold italic">
            Cost per Unit
            </label>
            <input
            type="number"
            id="cost"
            placeholder="Enter cost per unit"
            className="shadow-none text-sm h-[45px]"
            onChange={(e) => setCost(e.target.value)}
            />

            <Button
            onClick={(e) => handleSubmit(e)}
            className="mt-4 h-[45px]"
            >
            Create Product
            </Button>
          </div>
        </div>
    </div>
  )
}

export default SupplierNewProduct