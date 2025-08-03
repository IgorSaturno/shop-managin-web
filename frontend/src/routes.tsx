import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { NotFound } from "./pages/404";

import { Dashboard } from "./pages/app/dashboard";
import { Orders } from "./pages/app/orders";
// import { Overview } from "./pages/app/overview";

import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";

import { Error } from "./pages/error";
import Products from "./pages/app/products";
// import { User } from "./pages/app/user";
// import { Settings } from "./pages/app/settings";
import { Customers } from "./pages/app/customers";

import { ManagementAttributes } from "./pages/app/management-attributes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      // { path: "/overview", element: <Overview /> },
      { path: "/", element: <Dashboard /> },
      { path: "/orders", element: <Orders /> },
      { path: "/products", element: <Products /> },
      { path: "/customers", element: <Customers /> },
      {
        path: "/attributes-management",
        element: <ManagementAttributes />,
      },
      // { path: "/user", element: <User /> },
      // { path: "/support", element: <Support /> },
      // { path: "/settings", element: <Settings /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
