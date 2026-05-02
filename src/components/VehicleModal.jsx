export default function VehicleModal({ children, open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="vehicle-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
          X
        </button>
        {children}
      </section>
    </div>
  );
}