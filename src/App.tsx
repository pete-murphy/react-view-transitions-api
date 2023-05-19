import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  To,
  useParams,
} from "react-router-dom";
import movies_ from "./movies.json";

const movies = movies_
  .map((movie) => ({
    ...movie,
    thumbnailURL: {
      full: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${600}`,
      small: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${160}`,
    },
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

export default function App() {
  return (
    <Routes>
      <Route index element={<Movies />} />
      <Route path="movie/:movieId" element={<Movie />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

function Movies() {
  const navigate_ = useNavigate();
  const navigate =
    (nextRoute: To): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      if (!document.startViewTransition) {
        return navigate_(nextRoute);
      } else {
        // @ts-ignore
        event.currentTarget.firstElementChild.style.viewTransitionName =
          "image-test";
        return document.startViewTransition(() => {
          // return navigate_(nextRoute);
          return ReactDOM.flushSync(() => navigate_(nextRoute));
        });
      }
    };

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <button onClick={navigate(`/movie/${movie.id}`)}>
            <img src={movie.thumbnailURL.full} alt={movie.title} />
          </button>
        </li>
      ))}
    </ul>
  );
}

function Movie() {
  const { movieId } = useParams();
  const movie = movies.find((movie) => movie.id === movieId)!;
  return (
    <figure>
      <img
        style={{
          // @ts-ignore
          viewTransitionName: "image-test",
        }}
        src={movie.thumbnailURL.full}
        alt={movie.title}
      />
    </figure>
  );
}

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
