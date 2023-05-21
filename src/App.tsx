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
import _movies from "./movies.json";

const movies = _movies
  .map((movie) => ({
    ...movie,
    thumbnailURL: {
      large: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${600}`,
      small: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${160}`,
    },
  }))
  .sort((a, b) => a.title.localeCompare(b.title));
type Movie = (typeof movies)[number];

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

function MovieItem({ movie }: { movie: Movie }) {
  const [navigate, ref] =
    useNavigateWithViewTransition<HTMLImageElement>("movie-image");

  return (
    <button onClick={() => navigate(`/movie/${movie.id}`)}>
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

function useNavigateWithViewTransition<T extends HTMLElement = HTMLElement>(
  viewTransitionName: string
) {
  const ref = React.useRef<T>(null);

  const navigate = useNavigate();
  const navigateWithViewTransition = React.useCallback(
    (nextRoute: To) => {
      if (document.startViewTransition && ref.current) {
        ref.current.style.viewTransitionName = viewTransitionName;

        document.startViewTransition(() => {
          ReactDOM.flushSync(() => {
            navigate(nextRoute);
          });
        });
      } else {
        navigate(nextRoute);
      }
    },
    [navigate]
  );

  return [navigateWithViewTransition, ref] as const;
}
