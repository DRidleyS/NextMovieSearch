import type { OmdbSearchItem } from "@/types/omdb";

export default function MovieCard({
  movie,
  index,
}: {
  movie: OmdbSearchItem;
  index: number;
}) {
  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";
  return (
    <a
      href={`/movie/${movie.imdbID}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img
          src={poster}
          alt={`${movie.Title} poster`}
          style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
        />
        <div
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1rem", color: "white" }}>
            {movie.Title}
          </h3>
          <p style={{ margin: "0.25rem 0", color: "#ccc" }}>
            {movie.Year} • {movie.Type}
          </p>
        </div>
      </article>
    </a>
  );
}
