import GenreRow from "./GenreRow";

export default function ExploreSection() {
  const genres = [
    { name: "Action Movies", search: "action" },
    { name: "Comedy Movies", search: "comedy" },
    { name: "Drama Movies", search: "drama" },
    { name: "Science Fiction", search: "star" },
  ];

  return (
    <div
      style={{
        marginTop: "2rem",
        width: "100%",
        maxWidth: "960px",
        margin: "2rem auto 0",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: "2rem",
          marginBottom: "1.5rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        Explore
      </h2>
      {genres.map((genre) => (
        <GenreRow
          key={genre.name}
          genre={genre.name}
          searchTerm={genre.search}
        />
      ))}
    </div>
  );
}
