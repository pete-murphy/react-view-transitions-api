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
  React.useEffect(() => {
    const style = document.createElement("style");
    for (const movie of movies) {
      const transitionId = `movie-image-${movie.id})`;
      style.innerHTML += `
        ::view-transition-old(${transitionId}),
        ::view-transition-new(${transitionId}) {
          height: 100%;
          animation: none;
          overflow: clip;
          mix-blend-mode: normal;
          object-position: 0;
        }
        
        ::view-transition-old(${transitionId}) {
          object-fit: contain;
        }
        ::view-transition-new(${transitionId}) {
          object-fit: cover;
        }
        
        .back-transition::view-transition-old(${transitionId}) {
          object-fit: cover;
        }
        .back-transition::view-transition-new(${transitionId}) {
          object-fit: contain;
        }
      `;
    }
    document.head.appendChild(style);
  }, []);
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
  const navigate = useNavigateWithViewTransition<HTMLImageElement>();

  return (
    <button onClick={() => navigate(`/movie/${movie.id}`)}>
      <img
        // ref={ref}
        // data-transition-id={movie.id}
        style={{ viewTransitionName: `movie-image-${movie.id}` }}
        src={movie.thumbnailURL.large}
        alt={movie.title}
      />
    </button>
  );
}

function Movie() {
  const { movieId } = useParams();
  const movie = movies.find((movie) => movie.id === movieId)!;
  const navigate = useNavigateWithViewTransition<HTMLImageElement>();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back</button>
      <figure>
        <img
          style={{ viewTransitionName: `movie-image-${movie.id}` }}
          src={movie.thumbnailURL.large}
          alt={movie.title}
        />
      </figure>
    </div>
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

function useNavigateWithViewTransition<T extends HTMLElement = HTMLElement>() {
  // params: { viewTransitionName?: string; uniqueId?: string } = {}
  // const ref = React.useRef<T>(null);

  const navigate = useNavigate();
  const navigateWithViewTransition = React.useCallback(
    async (nextRoute: string) => {
      if (document.startViewTransition) {
        const isBackNavigation = nextRoute === "/";
        if (isBackNavigation) {
          document.documentElement.classList.add("back-transition");
        }

        // ref.current.style.viewTransitionName = params.viewTransitionName;

        const transition = document.startViewTransition(() => {
          ReactDOM.flushSync(() => {
            navigate(nextRoute);
          });
          // if (isBackNavigation) {
          //   document.querySelector(`[data-transition-id=${params.uniqueId}]`)
          //     ?.scrollIntoView;
          // }
        });

        try {
          await transition.finished;
        } finally {
          document.documentElement.classList.remove("back-transition");
        }
      } else {
        navigate(nextRoute);
      }
    },
    [navigate]
  );

  return navigateWithViewTransition;
}
