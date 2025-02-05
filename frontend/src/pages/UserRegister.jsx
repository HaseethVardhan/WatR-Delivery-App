import React from "react";
import Navbar from "../customComponents/Navbar.jsx";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UserRegister = () => {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();

  }

  return (
    <div>
      <Navbar />
      <div className="w-screen flex flex-col justify-center items-center">
        <h1 className="font-black text-xl py-5">User Register</h1>
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
