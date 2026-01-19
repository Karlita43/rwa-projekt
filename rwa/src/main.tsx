import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cocktails from "./pages/Cocktails";
import Category from "./pages/Category";
import Login from "./pages/Login";
import CocktailDetails from "./pages/CocktailDetails";

import "./style.css";
import "./login.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // svi kokteli
      { path: "kokteli", element: <Cocktails /> },

      // detalji koktela po ID-u (klik na karticu iz liste)
      { path: "kokteli/:id", element: <CocktailDetails /> },

      // postojeća ruta za kategoriju (ostavljamo kako je bilo)
      { path: "kokteli/:slug", element: <Category /> },

      { path: "o-nama", element: <div className="page"><h2>O nama</h2></div> },

      { path: "login", element: <Login onClose={() => { }} /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


/*

// ovo je za korištenje tokena za autorizaciju nakon prijave/registracije
  const token = localStorage.getItem("token");

fetch("http://localhost:8000/api/me", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

*/