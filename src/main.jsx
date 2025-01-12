import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Completed from "./completed.jsx";
import Dashboard from "./dashboard.jsx";
import History from "./history.jsx";
import InTransit from "./intransit.jsx";
import LoginPage from "./login.jsx";
import SignUpPage from "./signup.jsx";
import Station from "./stations/station.jsx";
import ToShip from "./toship.jsx";
import UserDashboard from "./user.jsx";
import { UserProvider } from "./usercontext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/userdashboard",
    element: <UserDashboard />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/toship",
    element: <ToShip />,
  },
  {
    path: "/intransit",
    element: <InTransit />,
  },
  {
    path: "/completed",
    element: <Completed />,
  },
  {
    path: "/station",
    element: <Station />,
  },
  {
    path: "/history",
    element: <History />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
