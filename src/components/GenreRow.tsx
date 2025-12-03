"use client";

import { useEffect, useState } from "react";
import type { OmdbSearchItem, OmdbSearchResponse } from "@/types/omdb";

export default function GenreRow({
  genre,
  searchTerm,
}: {
  genre: string;
  searchTerm: string;
}) {
  const [movies, setMovies] = useState<OmdbSearchItem[]>([]);

  useEffect(() => {
    fetch(`/api/omdb?s=${encodeURIComponent(searchTerm)}`)
      .then((r) => r.json())
      .then((data: OmdbSearchResponse) => {
        if (data.Response === "True") {
          setMovies(data.Search.slice(0, 10));
        }
      })
      .catch(() => {});
  }, [searchTerm]);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${genre}`);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies.length) return null;

  return (
    <div
      style={{
        marginBottom: "2rem",
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto 2rem",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "1.5rem",
          marginBottom: "1rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {genre}
      </h2>
      <div style={{ position: "relative", width: "100%", maxWidth: "100%" }}>
        <button
          className="scroll-button"
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          ‹
        </button>
        <div
          id={`scroll-${genre}`}
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "0.5rem 0",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {movies.map((movie) => (
            <a
              key={movie.imdbID}
              href={`/movie/${movie.imdbID}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                minWidth: "160px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450?text=No+Poster"
                  }
                  alt={`${movie.Title} poster`}
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <h3
                    style={{ margin: 0, fontSize: "0.875rem", color: "white" }}
                  >
                    {movie.Title}
                  </h3>
                  <p
                    style={{
                      margin: "0.25rem 0 0",
                      color: "#ccc",
                      fontSize: "0.75rem",
                    }}
                  >
                    {movie.Year}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        <button
          className="scroll-button"
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: "18px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          ›
        </button>
      </div>
      <style jsx>{`
        #scroll-${genre}::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
