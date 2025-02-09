import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "remixicon/fonts/remixicon.css";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import SupplierContext from "./context/SupplierContext.jsx";

createRoot(document.getElementById("root")).render(
  <SupplierContext>
    <UserContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContext>
  </SupplierContext>
);
