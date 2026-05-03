import VehicleRow from './VehicleRow';

export default function VehicleTable({ vehicles, onToggleAvailability, onMoveToTrash }) {
  return (
    <section className="vehicle-table-card" aria-label="Liste des véhicules">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>État</th>
            <th>Disponibilité</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <VehicleRow
              vehicle={vehicle}
              key={vehicle.id}
              onToggleAvailability={onToggleAvailability}
              onMoveToTrash={onMoveToTrash}
            />
          ))}
        </tbody>
      </table>
      {vehicles.length === 0 && <p className="empty-state">Aucun véhicule trouvé.</p>}
    </section>
  );
}