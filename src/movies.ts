import _movies from "./movies.json";

export const movies = _movies
  .map((movie) => ({
    ...movie,
    thumbnailURL: {
      large: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${600}`,
      small: `${movie.thumbnailURL}?auto=format%2Ccompress&q=100&h=${160}`,
    },
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

export type Movie = (typeof movies)[number];
