import React, { useContext, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { SupplierDataContext } from "../context/SupplierContext.jsx";

const SupplierProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {supplier, setsupplier} = useContext(SupplierDataContext)

  useEffect(() => {
    if (!token || token === null) {
      navigate("/supplier-login");
    } else {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/supplier/get-supplier-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setsupplier(response.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
          navigate("/supplier-login");
        });
    }
  }, [token, navigate, setsupplier]);

  return <>{children}</>;
};

export default SupplierProtectedWrapper;
