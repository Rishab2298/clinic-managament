import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./components/spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { routes } from "./routeConfig";
import { message } from "antd";

message.config({
  top: 80, // Adjust the top position (optional)
  duration: 2, // Default duration for messages (optional)
  maxCount: 3, // Maximum number of messages displayed (optional)

  prefixCls: "my-message", // Custom CSS prefix class (optional)
});
function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <BrowserRouter>
      {loading ? (
        <Spinner />
      ) : (
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : route.public ? (
                  <PublicRoute>{route.element}</PublicRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
