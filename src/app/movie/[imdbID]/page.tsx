import type {
  OmdbMovie,
  OmdbSearchItem,
  OmdbSearchResponse,
} from "@/types/omdb";

function BackgroundVideo() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/k87vvMrrlBo?autoplay=1&mute=1&loop=1&playlist=k87vvMrrlBo&controls=0&showinfo=0&modestbranding=1&playsinline=1"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "56.25vw",
            minHeight: "100vh",
            minWidth: "177.77vh",
            transform: "translate(-50%, -50%)",
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

async function getMovie(imdbID: string): Promise<OmdbMovie> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/omdb?i=${imdbID}`, {
    cache: "no-store",
  });
  return res.json();
}

async function getRelatedMovies(
  title: string,
  currentImdbID: string
): Promise<OmdbSearchItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // Extract main keyword from title (first word that's not an article)
  const searchTerm =
    title
      .split(" ")
      .find((word) => !["the", "a", "an"].includes(word.toLowerCase())) ||
    title.split(" ")[0];
  const res = await fetch(
    `${baseUrl}/api/omdb?s=${encodeURIComponent(searchTerm)}`,
    {
      cache: "no-store",
    }
  );
  const data: OmdbSearchResponse = await res.json();
  if (data.Response === "True") {
    return data.Search.filter((movie) => movie.imdbID !== currentImdbID).slice(
      0,
      4
    );
  }
  return [];
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ imdbID: string }>;
}) {
  const { imdbID } = await params;
  const data = await getMovie(imdbID);
  const relatedMovies =
    data.Response !== "False" ? await getRelatedMovies(data.Title, imdbID) : [];

  if (data.Response === "False") {
    return (
      <>
        <BackgroundVideo />
        <main
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "8px",
              padding: "1.5rem",
              color: "white",
            }}
          >
            <h1>Not found</h1>
            <p>{data.Error ?? "No details available."}</p>
          </div>
        </main>
      </>
    );
  }

  const poster =
    data.Poster && data.Poster !== "N/A"
      ? data.Poster
      : "https://via.placeholder.com/600x900?text=No+Poster";

  return (
    <>
      <BackgroundVideo />
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "1rem",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .movie-container {
              background-color: rgba(0, 0, 0, 0.8);
              border-radius: 8px;
              padding: 1.5rem;
              color: white;
            }
            .movie-grid {
              display: grid;
              gap: 1.5rem;
              grid-template-columns: 1fr;
            }
            .movie-poster {
              width: 100%;
              max-width: 300px;
              margin: 0 auto;
              border-radius: 8px;
            }
            .movie-title {
              color: white;
              font-size: 1.5rem;
              margin-top: 0;
            }
            .related-movie-card {
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 8px;
              overflow: hidden;
              transition: transform 0.3s ease;
            }
            .related-movie-card:hover {
              transform: scale(1.05);
            }
            .back-button {
              display: inline-block;
              margin-bottom: 1rem;
              padding: 0.5rem 1rem;
              background-color: rgba(255, 255, 255, 0.1);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              transition: background-color 0.2s;
            }
            .back-button:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }
            @media (min-width: 768px) {
              .movie-grid {
                grid-template-columns: 300px 1fr;
              }
              .movie-poster {
                margin: 0;
              }
              .movie-title {
                font-size: 2rem;
              }
            }
          `,
          }}
        />
        <a href="/" className="back-button">
          ← Back to Search
        </a>
        <div className="movie-container">
          <div className="movie-grid">
            <img
              src={poster}
              alt={`${data.Title} poster`}
              className="movie-poster"
            />
            <section>
              <h1 className="movie-title">
                {data.Title} ({data.Year})
              </h1>
              <p style={{ color: "#ddd", lineHeight: "1.6" }}>
                {data.Plot && data.Plot !== "N/A"
                  ? data.Plot
                  : "Plot not available."}
              </p>
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "0.5rem 0.75rem",
                  color: "#ccc",
                }}
              >
                <dt style={{ fontWeight: "bold", color: "white" }}>Genre</dt>
                <dd style={{ margin: 0 }}>{data.Genre ?? "—"}</dd>
                <dt style={{ fontWeight: "bold", color: "white" }}>Director</dt>
                <dd style={{ margin: 0 }}>{data.Director ?? "—"}</dd>
                <dt style={{ fontWeight: "bold", color: "white" }}>Actors</dt>
                <dd style={{ margin: 0 }}>{data.Actors ?? "—"}</dd>
                <dt style={{ fontWeight: "bold", color: "white" }}>Rating</dt>
                <dd style={{ margin: 0 }}>{data.imdbRating ?? "—"}</dd>
                <dt style={{ fontWeight: "bold", color: "white" }}>Runtime</dt>
                <dd style={{ margin: 0 }}>{data.Runtime ?? "—"}</dd>
              </dl>
            </section>
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <div className="movie-container" style={{ marginTop: "1.5rem" }}>
            <h2
              style={{
                color: "white",
                fontSize: "1.25rem",
                marginTop: 0,
                marginBottom: "1rem",
              }}
            >
              Related Movies
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "1rem",
              }}
            >
              {relatedMovies.map((movie) => (
                <a
                  key={movie.imdbID}
                  href={`/movie/${movie.imdbID}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="related-movie-card">
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
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          color: "white",
                        }}
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
          </div>
        )}
      </main>
    </>
  );
}
