import StatusBadge from './StatusBadge';

export default function VehicleRow({ vehicle, onToggleAvailability, onMoveToTrash }) {
  return (
    <tr>
      <td>{vehicle.nom}</td>
      <td>{vehicle.etat}</td>
      <td>
        <div className="availability-cell">
          <StatusBadge value={vehicle.disponibilite} />
          <button
            type="button"
            className="row-dropdown"
            aria-label={`Changer la disponibilité de ${vehicle.nom}`}
            onClick={() => onToggleAvailability(vehicle.id)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m7 10 5 5 5-5H7Z" />
            </svg>
          </button>
        </div>
      </td>
      <td>
        <button
          type="button"
          className="trash-button"
          onClick={() => onMoveToTrash(vehicle.id)}
          aria-label={`Mettre ${vehicle.nom} dans la corbeille`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 4h8l1 2h4v2H3V6h4l1-2Zm-1 6h10l-.7 10H7.7L7 10Zm3 2v6h2v-6h-2Zm4 0v6h2v-6h-2Z" />
          </svg>
        </button>
      </td>
    </tr>
  );
}