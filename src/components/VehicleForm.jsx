import { useState } from 'react';
import Button from './Button';

const defaultForm = {
  nom: '',
  etat: 'Bon',
  disponibilite: 'Disponible',
};

export default function VehicleForm({ onCancel, onSave }) {
  const [form, setForm] = useState(defaultForm);

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...form,
      nom: form.nom.trim() || 'Nouveau véhicule',
    });
    setForm(defaultForm);
  }

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <div className="modal-title-row">
        <span className="modal-vehicle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 11 7.25 6h9.5L19 11h1a1 1 0 0 1 1 1v5h-2v2h-3v-2H8v2H5v-2H3v-5a1 1 0 0 1 1-1h1Zm2.2 0h9.6l-1.35-3H8.55L7.2 11ZM7 15.4A1.4 1.4 0 1 0 7 12.6a1.4 1.4 0 0 0 0 2.8Zm10 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" />
          </svg>
        </span>
        <h2 id="vehicle-modal-title">Ajouter véhicule</h2>
      </div>

      <label>
        Nom
        <input value={form.nom} onChange={(event) => updateField('nom', event.target.value)} />
      </label>

      <label>
        État
        <select value={form.etat} onChange={(event) => updateField('etat', event.target.value)}>
          <option>Bon</option>
          <option>En panne</option>
          <option>Entretien</option>
        </select>
      </label>

      <label>
        Disponibilité
        <select
          value={form.disponibilite}
          onChange={(event) => updateField('disponibilite', event.target.value)}
        >
          <option>Disponible</option>
          <option>Non dispo</option>
        </select>
      </label>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}