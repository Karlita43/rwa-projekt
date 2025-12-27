import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cocktails from "./pages/Cocktails";
import Category from "./pages/Category";
import Login from "./pages/Login";


import "./style.css";
import "./login.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "kokteli", element: <Cocktails /> },
      { path: "kokteli/:slug", element: <Category /> },
      { path: "o-nama", element: <div className="page"><h2>O nama</h2></div> },
      
      { path: "login", element: <Login onClose={() => {}} /> }

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
