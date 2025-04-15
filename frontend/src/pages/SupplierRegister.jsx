import React from 'react'
import Navbar from "../customComponents/Navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {SupplierDataContext} from '../context/SupplierContext.jsx'


const SupplierRegister = () => {


  const navigate = useNavigate()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [suppliername, setSuppliername] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState();
  const [otheraddress, setOtherAddress] = React.useState();
  const [suggestedAddresses, setSuggestedAddresses] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [popup, setPopup] = React.useState(false);
  const [errorDisplay, setErrorDisplay] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const {supplier, setsupplier} = React.useContext(SupplierDataContext)

  React.useEffect(() => {

    const func = async() => {

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/address/get-address-suggestions`, {
        input: address
      })
  
      setSuggestedAddresses(response.data.data)
      setPopup(true)
    }

    func()
    console.log(suggestedAddresses)

  }, [address])

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/supplier/register`,{
        username,
        suppliername,
        email,
        phone,
        password,
        placeId: otheraddress.placeId,
        placeString: otheraddress.placeString
      })

      
      
      if(response.status === 201){
        setLoading(false);
        setsupplier(response.data.data.supplier);
        localStorage.setItem('token', response.data.data.token);
        navigate('/supplier-home');
      }
    } catch (error) {
      console.log(error)
        setLoading(false);
        setErrorMessage(error.response.data.message);
        setErrorDisplay(true);
    }
  }

  return (
    <div className="relative">
      {loading && <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm font-semibold text-2xl">
        Loading...
      </div>}
      <Navbar />
      <div className="w-screen flex flex-col justify-center items-center">
        <h1 className="font-black text-xl py-5">Supplier Register</h1>
        <div className="text-red-500 text-sm font-semibold">
          {errorDisplay && errorMessage}
        </div>
        <div className="w-[80%] max-w-[500px] flex flex-col">
          <Label htmlFor="firstname" className="py-2 px-2 font-semibold italic">
            Username
          </Label>
          <Input
            type="username"
            id="username"
            placeholder="Enter your user name"
            className="shadow-none text-sm h-[45px]"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Label htmlFor="lastname" className="py-2 px-2 font-semibold italic">
            Supplier name
          </Label>
          <Input
            type="suppliername"
            id="suppliername"
            placeholder="Enter your company name"
            className="shadow-none text-sm h-[45px]"
            value={suppliername}
            onChange={(e) => {
              setSuppliername(e.target.value);
            }}
          />
          <Label htmlFor="phone" className="py-2 px-2 font-semibold italic">
            Phone
          </Label>
          <Input
            type="phone"
            id="phone"
            placeholder="Enter your phone"
            className="shadow-none text-sm h-[45px]"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <Label htmlFor="address" className="py-2 px-2 font-semibold italic">
            Company Address
          </Label>
          <Input
            type="address"
            id="address"
            placeholder="Enter your address"
            className="shadow-none text-sm h-[45px]"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
         {popup && suggestedAddresses.map((lm, idx) => {
          return(
            <div key={idx} className='px-1 py-1' onClick={
              () => {
                setAddress(lm.description)
                setOtherAddress({
                  placeString: lm.description,
                  placeId: lm.place_id
                })
                setPopup(false)
              }
            }>
              <p className='text-sm'>{lm.description}</p>
            </div>
          )
         })}
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
            Register
          </Button>
        </div>
        <div className="w-[80%] max-w-[500px] flex flex-col">
          <p className="py-3 text-sm font-extrathin text-gray-400 text-center">
            or
          </p>
          <Link to="/supplier-login">
            <Button
              variant="secondary"
              className="w-full h-[45px] font-bold bg-gray-100"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SupplierRegister
