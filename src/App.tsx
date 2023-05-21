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
      large: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${600}`,
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
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieItem movie={movie} />
        </li>
      ))}
    </ul>
  );
}

function MovieItem({ movie }: { movie: (typeof movies)[number] }) {
  const ref = React.useRef<HTMLImageElement>(null);

  const navigate = useNavigate();

  const navigateWithViewTransition = (nextRoute: To) => {
    if (document.startViewTransition && ref.current) {
      ref.current.style.viewTransitionName = "movie-image";
      document.startViewTransition(() => {
        ReactDOM.flushSync(() => {
          navigate(nextRoute);
        });
      });
    } else {
      navigate(nextRoute);
    }
  };

  return (
    <button onClick={() => navigateWithViewTransition(`/movie/${movie.id}`)}>
      <img ref={ref} src={movie.thumbnailURL.large} alt={movie.title} />
    </button>
  );
}

function Movie() {
  const { movieId } = useParams();
  const movie = movies.find((movie) => movie.id === movieId)!;
  return (
    <figure>
      <img
        style={{ viewTransitionName: "movie-image" }}
        src={movie.thumbnailURL.large}
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
