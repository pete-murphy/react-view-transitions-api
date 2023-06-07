import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Movie, Movies } from "./App";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import { movies } from "./movies";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Movies />,
    errorElement: <NoMatch />,
  },
  {
    loader: ({ params }) => {
      // @NOTE: We could prefetch the next route's data here
      const movie = movies.find((movie) => movie.id === params.movieId)!;
      return fetch(movie.thumbnailURL.large);
    },
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
