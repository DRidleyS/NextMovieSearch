import type { OmdbSearchItem } from "@/types/omdb";
import MovieCard from "./MovieCard";

export default function ResultsGrid({ items }: { items: OmdbSearchItem[] }) {
  if (!items.length) return null;
  return (
    <section
      aria-label="Search results"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1rem",
      }}
    >
      {items.map((m, index) => (
        <MovieCard key={m.imdbID} movie={m} index={index} />
      ))}
    </section>
  );
}
