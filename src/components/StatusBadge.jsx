export default function StatusBadge({ value }) {
  const isAvailable = value === 'Disponible';

  return (
    <span className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
      <span className="status-dot" aria-hidden="true" />
      {value}
    </span>
  );
}