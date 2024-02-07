import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import LoginPage from "./containers/LoginPage/LoginPage";
import HomePage from "./containers/HomePage/HomePage";
import PasswordCreationPage from "./containers/PasswordCreationPage/PasswordCreationPage";
import ObserversRegisterPage from "./containers/ObserversRegisterPage/ObserversRegisterPage";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
const backendUrl = process.env.REACT_APP_BACKEND!;
export const socket = io(backendUrl);
const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/passwordcreate",
    element: <PasswordCreationPage />,
  },
  {
    path: "/register",
    element: <ObserversRegisterPage />,
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </React.StrictMode>
);
