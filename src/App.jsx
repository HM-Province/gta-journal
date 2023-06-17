import * as React from "react";
import * as ReactDOM from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.body
);
