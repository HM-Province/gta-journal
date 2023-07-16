import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "./theme/common/theme.scss";
import Root from "./views/Root.jsx";
import Login from "./views/Login.jsx";
import WindowTopbar from "./components/WindowTopbar.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Logout from "./views/Logout.jsx";
import Top from "./views/Top.jsx";
import Stats from "./views/Stats.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Settings from "./views/Settings.jsx";
import AddUser from "./views/users/Add.jsx";
import PrimeReact from 'primereact/api';
import EditUser from "./views/users/Edit.jsx";
import UserStats from "./views/users/Stats.jsx";

PrimeReact.ripple = true;

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/top",
        element: <Top />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: "/users/add",
        element: <AddUser />
      },
      {
        path: "/users/edit",
        element: <EditUser />
      },
      {
        path: "/users/stats",
        element: <UserStats />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WindowTopbar />
      <main className="flex" style={{ paddingTop: "33px" }}>
        <RouterProvider router={router} />
      </main>
    </Provider>
  </React.StrictMode>
);