import React from "react";
import Navbar from "../customComponents/Navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {UserDataContext} from '../context/UserContext'

const UserRegister = () => {

  const navigate = useNavigate()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [errorDisplay, setErrorDisplay] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const {user, setuser} = React.useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`,{
        firstname,
        lastname,
        email,
        phone,
        password
      })
      
      if(response.status === 201){
        setLoading(false);
        setuser(response.data.data.user);
        localStorage.setItem('token', response.data.data.token);
        navigate('/user-home');
      }
    } catch (error) {
        setLoading(false);
        setErrorMessage(error.response.data.data.message);
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
        <h1 className="font-black text-xl py-5">User Register</h1>
        <div className="text-red-500 text-sm font-semibold">
          {errorDisplay && errorMessage}
        </div>
        <div className="w-[80%] max-w-[500px] flex flex-col">
          <Label htmlFor="firstname" className="py-2 px-2 font-semibold italic">
            Firstname
          </Label>
          <Input
            type="firstname"
            id="firstname"
            placeholder="Enter your firstname"
            className="shadow-none text-sm h-[45px]"
            value={firstname}
            onChange={(e) => {
              setFirstname(e.target.value);
            }}
          />
          <Label htmlFor="lastname" className="py-2 px-2 font-semibold italic">
            Lastname
          </Label>
          <Input
            type="lastname"
            id="lastname"
            placeholder="Enter your lastname"
            className="shadow-none text-sm h-[45px]"
            value={lastname}
            onChange={(e) => {
              setLastname(e.target.value);
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
          <Link to="/login">
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
  );
};

export default UserRegister;
