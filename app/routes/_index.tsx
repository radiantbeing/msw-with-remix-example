import { useState } from "react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader: LoaderFunction = async () => {
  const response = await fetch("https://api.example.com/user");
  const serverSideData = await response.json();

  return {
    serverSideData,
  };
};

export default function Index() {
  const { serverSideData } = useLoaderData<typeof loader>();
  const [favoriteMovies, setFavoriteMovies] = useState<{
    data: { movies: Array<{ id: string; title: string }> };
  } | null>(null);

  const handleClick = () => {
    fetch("/api/runtime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ListMovies {
            movie {
              title
            }
          }
        `,
      }),
    })
      .then((response) => response.json())
      .then(setFavoriteMovies);
  };

  return (
    <div className="font-sans text-gray-900 p-4">
      <p className="text-xl font-bold mb-4">
        Hello, {serverSideData.firstName}!
      </p>
      {favoriteMovies?.data ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            My favorite movies ({favoriteMovies.data.movies.length})
          </h2>
          <ul className="list-disc pl-5">
            {favoriteMovies.data.movies.map((movie) => (
              <li key={movie.id} className="mb-1">
                {movie.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-gray-300 text-gray-700"
      >
        Make a runtime request
      </button>
    </div>
  );
}
