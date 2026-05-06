import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import UserSidebar from "../components/UserSidebar";
import VehicleModal from "../components/VehicleModal";
import {
  getVehicles,
  getTrashVehicles,
  saveVehicles,
  saveTrashVehicles,
  getHistory,
  saveHistory,
} from "../database";
import { formatDeleteDate, getDeleteInfo } from "../utils/trashDelay";

const defaultForm = {
  nom: "",
  modele: "",
  annee: "",
  immatriculation: "",
  conducteur: "",
  etat: "Bon",
  disponibilite: "Disponible",
};

export default function Vehicules({ user, onNavigate, onLogout }) {
  const [vehicles, setVehicles] = useState(() => getVehicles());
  const [trashVehicles, setTrashVehicles] = useState(() => getTrashVehicles());
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  function addToHistory(action, vehicleName) {
    const history = getHistory() || [];
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      action: action,
      vehicle: vehicleName,
      user: user?.nom || "Utilisateur inconnu",
      timestamp: new Date().toISOString(),
    };
    history.unshift(newEntry);
    saveHistory(history);
  }

  useEffect(() => {
    saveVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    saveTrashVehicles(trashVehicles);
  }, [trashVehicles]);

  const filteredVehicles = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return vehicles;
    return vehicles.filter(
      (vehicle) =>
        (vehicle.nom?.toLowerCase() || "").includes(value) ||
        (vehicle.modele?.toLowerCase() || "").includes(value) ||
        (vehicle.immatriculation?.toLowerCase() || "").includes(value) ||
        (vehicle.conducteur?.toLowerCase() || "").includes(value),
    );
  }, [search, vehicles]);

  function handleChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleAddVehicle() {
    const {
      nom,
      modele,
      annee,
      immatriculation,
      conducteur,
      etat,
      disponibilite,
    } = form;

    if (!nom.trim()) {
      alert("Entre un nom de véhicule.");
      return;
    }

    if (!modele.trim() || !immatriculation.trim()) {
      alert("Le modèle et l'immatriculation sont obligatoires.");
      return;
    }

    const newVehicle = {
      id: Date.now(),
      nom: nom.trim(),
      modele: modele.trim(),
      annee: annee.trim(),
      immatriculation: immatriculation.trim().toUpperCase(),
      conducteur: conducteur.trim(),
      etat: etat,
      disponibilite: disponibilite,
    };

    setVehicles((currentVehicles) => [...currentVehicles, newVehicle]);

    addToHistory(`Ajouté: ${nom} (${immatriculation})`, nom);

    setForm(defaultForm);
    setIsModalOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleAddVehicle();
  }

  function handleMoveToTrash(vehicleId) {
    // Vérifier les permissions - tout le monde peut supprimer ses propres travaux
    const vehicleToTrash = vehicles.find((vehicle) => vehicle.id === vehicleId);
    if (!vehicleToTrash) return;

    // Admin a tous les droits, les autres utilisateurs ne peuvent supprimer que leurs propres travaux
    if (user?.role === "Admin") {
      // Admin peut supprimer n'importe quel véhicule
    } else {
      // Vérifier si le véhicule appartient à l'utilisateur actuel
      const currentUserHistory = getHistory().filter(
        (entry) => entry.vehicle === vehicleToTrash.nom,
      );
      const isOwnVehicle = currentUserHistory.some(
        (entry) => entry.user === user?.nom,
      );

      if (!isOwnVehicle) {
        alert("Vous ne pouvez supprimer que vos propres véhicules.");
        return;
      }
    }

    setVehicles((currentVehicles) =>
      currentVehicles.filter((vehicle) => vehicle.id !== vehicleId),
    );
    setTrashVehicles((currentTrash) => [
      {
        ...vehicleToTrash,
        deletedAt: new Date().toISOString(),
      },
      ...currentTrash,
    ]);

    addToHistory(`Supprimé: ${vehicleToTrash.nom}`, vehicleToTrash.nom);
  }

  return (
    <div className="dashboard-shell vehicles-shell">
      <UserSidebar
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="vehicules"
      />

      <main className="vehicles-main vehicles-main">
        <Header title="Véhicules">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <span aria-hidden="true" className="plus-icon">
              +
            </span>
            Ajouter Véhicules
          </Button>
        </Header>

        <SearchBar value={search} onChange={setSearch} />

        <section
          className="vehicle-table-card"
          aria-label="Liste des véhicules"
        >
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Modèle</th>
                <th>Immatriculation</th>
                <th>Conducteur</th>
                <th>État</th>
                <th>Disponibilité</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <strong>{vehicle.nom}</strong>
                    {vehicle.annee && (
                      <div style={{ fontSize: "0.8em", color: "#666" }}>
                        {vehicle.annee}
                      </div>
                    )}
                  </td>
                  <td>{vehicle.modele || "-"}</td>
                  <td>
                    <span
                      style={{ fontFamily: "monospace", fontWeight: "bold" }}
                    >
                      {vehicle.immatriculation || "-"}
                    </span>
                  </td>
                  <td>{vehicle.conducteur || "-"}</td>
                  <td>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          // Admin a tous les droits, les autres utilisateurs ne peuvent modifier que leurs propres travaux
                          if (user?.role === "Admin") {
                            // Admin peut modifier n'importe quel véhicule
                          } else {
                            // Vérifier si le véhicule appartient à l'utilisateur actuel
                            const currentUserHistory = getHistory().filter(
                              (entry) => entry.vehicle === vehicle.nom,
                            );
                            const isOwnVehicle = currentUserHistory.some(
                              (entry) => entry.user === user?.nom,
                            );

                            if (!isOwnVehicle) {
                              alert(
                                "Vous ne pouvez modifier que vos propres véhicules.",
                              );
                              return;
                            }
                          }

                          const newEtat =
                            vehicle.etat === "Bon"
                              ? "En panne"
                              : vehicle.etat === "En panne"
                                ? "Entretien"
                                : "Bon";
                          const currentTime = new Date().toLocaleTimeString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" },
                          );

                          const newDisponibilite =
                            newEtat === "Bon" ? "Disponible" : "Non disponible";

                          const updatedVehicles = vehicles.map((v) =>
                            v.id === vehicle.id
                              ? {
                                  ...v,
                                  etat: newEtat,
                                  disponibilite: newDisponibilite,
                                }
                              : v,
                          );
                          setVehicles(updatedVehicles);

                          addToHistory(
                            `État: ${vehicle.etat} (${currentTime}) -> ${newEtat}`,
                            vehicle.nom,
                          );
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          background:
                            vehicle.etat === "Bon"
                              ? "#f0fdf4"
                              : vehicle.etat === "En panne"
                                ? "#fef2f2"
                                : "#fffbeb",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {vehicle.etat === "Bon" ? (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="#28c76f"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <span style={{ color: "#28c76f" }}>Bon</span>
                          </>
                        ) : vehicle.etat === "En panne" ? (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="#ea5455"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span style={{ color: "#ea5455" }}>En panne</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="#ffcc4d"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span style={{ color: "#ffcc4d" }}>Entretien</span>
                          </>
                        )}
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="#666"
                          style={{ marginLeft: "4px" }}
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {vehicle.disponibilite === "Disponible" ? (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="#28c76f"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <span
                            style={{ color: "#28c76f", fontWeight: "bold" }}
                          >
                            Disponible
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="#ea5455"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                          <span
                            style={{ color: "#ea5455", fontWeight: "bold" }}
                          >
                            Non disponible
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="trash-button"
                      onClick={() => handleMoveToTrash(vehicle.id)}
                      aria-label={`Mettre ${vehicle.nom} dans la corbeille`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 4h8l1 2h4v2H3V6h4l1-2Zm-1 6h10l-.7 10H7.7L7 10Zm3 2v6h2v-6h-2Zm4 0v6h2v-6h-2Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <VehicleModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="modal-title-row">
            <span className="modal-vehicle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-8l-2.08-5.99zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
              </svg>
            </span>
            <h2 className="modal-title">Ajouter un véhicule</h2>
          </div>

          <div className="modal-form-grid">
            <div className="form-field">
              <label htmlFor="nom">Nom du véhicule*</label>
              <input
                id="nom"
                type="text"
                value={form.nom}
                onChange={(event) => handleChange("nom", event.target.value)}
                placeholder="Ex: Camion 4"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="modele">Modèle*</label>
              <input
                id="modele"
                type="text"
                value={form.modele}
                onChange={(event) => handleChange("modele", event.target.value)}
                placeholder="Ex: Range Rover Sport"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="annee">Année</label>
              <input
                id="annee"
                type="text"
                value={form.annee}
                onChange={(event) => handleChange("annee", event.target.value)}
                placeholder="Ex: 2023"
              />
            </div>

            <div className="form-field">
              <label htmlFor="immatriculation">Immatriculation*</label>
              <input
                id="immatriculation"
                type="text"
                value={form.immatriculation}
                onChange={(event) =>
                  handleChange("immatriculation", event.target.value)
                }
                placeholder="Ex: AB-123-CD"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="conducteur">Conducteur</label>
              <input
                id="conducteur"
                type="text"
                value={form.conducteur}
                onChange={(event) =>
                  handleChange("conducteur", event.target.value)
                }
                placeholder="Ex: Jean Dupont"
              />
            </div>

            <div className="form-field">
              <label htmlFor="etat">État</label>
              <select
                id="etat"
                value={form.etat}
                onChange={(event) => handleChange("etat", event.target.value)}
              >
                <option value="Bon">Bon</option>
                <option value="En panne">En panne</option>
                <option value="Entretien">Entretien</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="disponibilite">Disponibilité</label>
              <select
                id="disponibilite"
                value={form.disponibilite}
                onChange={(event) =>
                  handleChange("disponibilite", event.target.value)
                }
              >
                <option value="Disponible">Disponible</option>
                <option value="Non disponible">Non disponible</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <Button type="submit" variant="primary">
              <span aria-hidden="true" className="plus-icon">
                +
              </span>
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </VehicleModal>
    </div>
  );
}
