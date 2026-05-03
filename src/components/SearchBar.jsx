export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nom"
        aria-label="Rechercher par nom"
      />
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m20.7 19.3-4.2-4.2a7 7 0 1 0-1.4 1.4l4.2 4.2 1.4-1.4ZM5 11a6 6 0 1 1 12 0A6 6 0 0 1 5 11Z" />
      </svg>
    </label>
  );
}