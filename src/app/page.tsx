"use client";

import { useEffect, useMemo, useState } from "react";
import type { OmdbSearchItem, OmdbSearchResponse } from "@/types/omdb";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import BackgroundVideo from "@/components/BackgroundVideo";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResultsGrid from "@/components/ResultsGrid";
import Pagination from "@/components/Pagination";
import ExploreSection from "@/components/ExploreSection";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(query);

  const [results, setResults] = useState<OmdbSearchItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @media (max-width: 768px) {
        .scroll-button {
          display: none !important;
        }
        .search-container {
          justify-content: flex-start !important;
          padding-left: 32px !important;
        }
      }
      @media (min-width: 769px) {
        .search-input {
          max-width: 700px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults([]);
      setTotal(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    const url = `/api/omdb?s=${encodeURIComponent(q)}&page=${page}`;
    fetch(url)
      .then((r) => r.json())
      .then((data: OmdbSearchResponse) => {
        if (data.Response === "False") {
          setResults([]);
          setTotal(null);
          setError(data.Error ?? "No results");
        } else {
          setResults(data.Search);
          setTotal(Number(data.totalResults));
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [debouncedQuery, page]);

  const totalPages = useMemo(() => {
    if (!total) return 0;
    return Math.ceil(total / 10);
  }, [total]);

  return (
    <>
      <BackgroundVideo />
      <main
        style={{
          maxWidth: "960px",
          margin: "2rem auto",
          padding: "0 1rem",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <h1
          style={{
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            textAlign: "center",
          }}
        >
          Movie Search
        </h1>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <div
            className="search-container"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search movies (e.g., Inception)"
              aria-label="Search movies"
              className="search-input"
              style={{
                padding: "1rem 1rem",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                fontSize: "1.125rem",
                borderRadius: "8px",
                border: "none",
                width: "100%",
                maxWidth: "300px",
                boxSizing: "border-box",
              }}
            />
          </div>
          {loading && <LoadingSpinner />}
          {error && (
            <p role="alert" style={{ color: "white", textAlign: "center" }}>
              Error: {error}
            </p>
          )}
          {!query.trim() && !loading ? (
            <ExploreSection />
          ) : (
            <>
              <ResultsGrid items={results} />
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
