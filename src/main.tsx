import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Movie, Movies } from "./App";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Movies />,
    errorElement: <NoMatch />,
  },
  {
    path: "movie/:movieId",
    element: <Movie />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
