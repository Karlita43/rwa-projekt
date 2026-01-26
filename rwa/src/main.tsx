import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cocktails from "./pages/Cocktails";
import Category from "./pages/Category";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthGuard from "./AuthGuard";
import CocktailDetails from "./pages/CocktailDetails";
import CocktailEdit from "./pages/CocktailEdit";
import CocktailNew from "./pages/CocktailNew";
import UserPage from "./pages/User_page";
import About from "./pages/About";


import LoginContextProvider from "./LoginContextProvider";

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
      { path: "kategorija/:slug", element: <Category /> },


      { path: "o-nama", element: <About /> },

      // zaštićene rute
      {
        path: "kokteli/novo", element: ( <AuthGuard> <CocktailNew /> </AuthGuard>),
      },
      {
        path: "kokteli/:id/uredi", element: ( <AuthGuard> <CocktailEdit /> </AuthGuard> ),
      },
      { path: "profil", element: ( <AuthGuard> <UserPage /> </AuthGuard> ),
      },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoginContextProvider>
    <RouterProvider router={router} />
    </LoginContextProvider>
  </React.StrictMode>
);
