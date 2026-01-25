import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChakraProvider value={defaultSystem}>
      <AdminProvider>
        <App />
      </AdminProvider>
    </ChakraProvider>
  </BrowserRouter>,
);
