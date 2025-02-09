import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../customComponents/Navbar.jsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SupplierDataContext } from "../context/SupplierContext.jsx";
import axios from "axios";

const SupplierLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [errorDisplay, setErrorDisplay] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { supplier, setsupplier } = React.useContext(SupplierDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/supplier/login`,
        { email: email, password: password }
      );
  
      if (response.status === 200) {
        setLoading(false);
        setsupplier(response.data.data.supplier);
        localStorage.setItem("token", response.data.data.token);
        navigate("/supplier-home");
      }
    } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.data.message);
        setErrorDisplay(true);
    }
  };

  return (
    <div>
      {loading && (
        <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
          Loading...
        </div>
      )}
      <Navbar />
      <div className="w-screen flex flex-col justify-center items-center">
        <h1 className="font-black text-xl py-5">Supplier Login</h1>
        <div className="text-red-500 text-sm font-semibold">
          {errorDisplay && errorMessage}
        </div>
        <div className="w-[80%] max-w-[500px] flex flex-col">
          <Label htmlFor="email" className="py-2 px-2 font-semibold italic">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="shadow-none text-sm h-[45px]"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Label htmlFor="password" className="py-2 px-2 font-semibold italic">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="shadow-none text-sm h-[45px]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            onClick={(e) => {
              submitHandler(e);
            }}
            className="mt-4 h-[45px]"
          >
            Login
          </Button>
        </div>
        <div className="w-[80%] max-w-[500px] flex flex-col">
          <p className="py-3 text-sm font-extrathin text-gray-400 text-center">
            or
          </p>
          <Link to="/supplier-register">
            <Button
              variant="secondary"
              className="w-full h-[45px] font-bold bg-gray-100"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SupplierLogin