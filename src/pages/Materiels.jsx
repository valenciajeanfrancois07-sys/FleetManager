import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import UserSidebar from "../components/UserSidebar";
import VehicleModal from "../components/VehicleModal";
import {
  getMaterials,
  getTrashMaterials,
  saveMaterials,
  saveTrashMaterials,
  getHistory,
  saveHistory,
} from "../database";
import { formatDeleteDate, getDeleteInfo } from "../utils/trashDelay";

const defaultForm = {
  nom: "",
  quantite: 1,
  etat: "Bon",
  disponibilite: "Disponible",
};

export default function Materiels({ user, onNavigate, onLogout }) {
  const [materials, setMaterials] = useState(() => getMaterials());
  const [trashMaterials, setTrashMaterials] = useState(() =>
    getTrashMaterials(),
  );
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [permissionMessage, setPermissionMessage] = useState("");

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === "Admin";

  function addToHistory(action, materialName) {
    const history = getHistory() || [];
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      action: action,
      vehicle: materialName,
      user: user?.nom || "Utilisateur inconnu",
      timestamp: new Date().toISOString(),
    };
    history.unshift(newEntry);
    saveHistory(history);
  }

  useEffect(() => {
    saveMaterials(materials);
  }, [materials]);

  useEffect(() => {
    saveTrashMaterials(trashMaterials);
  }, [trashMaterials]);

  const filteredMaterials = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return materials;
    return materials.filter((material) =>
      material.nom.toLowerCase().includes(value),
    );
  }, [materials, search]);

  const materialStats = useMemo(
    () => ({
      total: materials.length,
      available: materials.filter((m) => m.disponibilite === "Disponible")
        .length,
      maintenance: materials.filter((m) => m.etat !== "Bon").length,
    }),
    [materials],
  );

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const materialName = form.nom.trim() || "Nouveau matériel";
    const etat = form.etat;

    const disponibilite = etat === "Bon" ? "Disponible" : "Non disponible";

    const newMaterial = {
      id: Date.now(),
      nom: materialName,
      quantite: Number(form.quantite) || 1,
      etat: etat,
      disponibilite: disponibilite,
    };

    setMaterials((currentMaterials) => [...currentMaterials, newMaterial]);

    addToHistory(`Ajouté: ${materialName}`, materialName);

    setForm(defaultForm);
    setIsModalOpen(false);
  }

  function handleRestore(materialId) {
    if (!isAdmin) {
      setPermissionMessage(
        "Seul un administrateur peut restaurer des matériels.",
      );
      setTimeout(() => setPermissionMessage(""), 3000);
      return;
    }

    const materialToRestore = trashMaterials.find(
      (material) => material.id === materialId,
    );
    if (!materialToRestore) return;

    const { deletedAt, ...restoredMaterial } = materialToRestore;
    setTrashMaterials((currentTrash) =>
      currentTrash.filter((material) => material.id !== materialId),
    );
    setMaterials((currentMaterials) => [restoredMaterial, ...currentMaterials]);
  }

  function handleMoveToTrash(materialId) {
    if (!isAdmin) {
      setPermissionMessage(
        "Seul un administrateur peut supprimer des matériels.",
      );
      setTimeout(() => setPermissionMessage(""), 3000);
      return;
    }

    const materialToDelete = materials.find(
      (material) => material.id === materialId,
    );
    if (!materialToDelete) return;

    setMaterials((currentMaterials) =>
      currentMaterials.filter((material) => material.id !== materialId),
    );
    setTrashMaterials((currentTrash) => [
      {
        ...materialToDelete,
        deletedAt: new Date().toISOString(),
      },
      ...currentTrash,
    ]);

    addToHistory(`Supprimé: ${materialToDelete.nom}`, materialToDelete.nom);
  }

  function handleDeleteForever(materialId) {
    if (!isAdmin) {
      setPermissionMessage(
        "Seul un administrateur peut supprimer définitivement des matériels.",
      );
      setTimeout(() => setPermissionMessage(""), 3000);
      return;
    }

    const materialToDelete = trashMaterials.find(
      (material) => material.id === materialId,
    );
    if (
      !materialToDelete ||
      !getDeleteInfo(materialToDelete.deletedAt).canDelete
    )
      return;

    setTrashMaterials((currentTrash) =>
      currentTrash.filter((material) => material.id !== materialId),
    );
  }

  return (
    <div className="dashboard-shell materiels-shell">
      <UserSidebar
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="materiels"
      />

      <main className="vehicles-main materiels-main">
        <Header title="Matériels">
          <Button
            variant="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <span aria-hidden="true" className="plus-icon">
              +
            </span>
            Ajouter Matériel
          </Button>
        </Header>

        {permissionMessage && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {permissionMessage}
          </div>
        )}

        <section className="page-summary-grid">
          <article className="metric-card">
            <span>Total matériels</span>
            <strong>{materialStats.total}</strong>
          </article>
          <article className="metric-card">
            <span>Disponibles</span>
            <strong>{materialStats.available}</strong>
          </article>
          <article className="metric-card">
            <span>Besoin d'entretien</span>
            <strong>{materialStats.maintenance}</strong>
          </article>
        </section>

        <SearchBar value={search} onChange={setSearch} />

        <section
          className="vehicle-table-card"
          aria-label="Liste des matériels"
        >
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Quantité</th>
                <th>État</th>
                <th>Disponibilité</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.id}>
                  <td>{material.nom}</td>
                  <td>{material.quantite}</td>
                  <td>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <button
                        type="button"
                        className={`status-pill ${
                          material.etat === "Bon"
                            ? "status-good"
                            : material.etat === "En panne"
                              ? "status-bad"
                              : "status-warning"
                        }`}
                        disabled={!isAdmin}
                        onClick={() => {
                          if (!isAdmin) {
                            setPermissionMessage(
                              "Seul un administrateur peut modifier l'état des matériels.",
                            );
                            setTimeout(() => setPermissionMessage(""), 3000);
                            return;
                          }

                          const newEtat =
                            material.etat === "Bon"
                              ? "En panne"
                              : material.etat === "En panne"
                                ? "Entretien"
                                : "Bon";
                          const currentTime = new Date().toLocaleTimeString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" },
                          );
                          const newDisponibilite =
                            newEtat === "Bon" ? "Disponible" : "Non disponible";
                          const updatedMaterials = materials.map((m) =>
                            m.id === material.id
                              ? {
                                  ...m,
                                  etat: newEtat,
                                  disponibilite: newDisponibilite,
                                }
                              : m,
                          );
                          setMaterials(updatedMaterials);
                          addToHistory(
                            `État: ${material.etat} (${currentTime}) -> ${newEtat}`,
                            material.nom,
                          );
                        }}
                        style={{
                          opacity: isAdmin ? 1 : 0.5,
                          cursor: isAdmin ? "pointer" : "not-allowed",
                        }}
                        title={
                          isAdmin
                            ? "Cliquez pour changer l'état"
                            : "Seul un admin peut modifier"
                        }
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="#ffffff"
                        >
                          {material.etat === "Bon" ? (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          ) : material.etat === "En panne" ? (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          ) : (
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          )}
                        </svg>
                        <span>
                          {material.etat === "Bon"
                            ? "Bon"
                            : material.etat === "En panne"
                              ? "En panne"
                              : "Entretien"}
                        </span>
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="#ffffff"
                          style={{ marginLeft: "4px" }}
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="availability-pill">
                      {material.disponibilite === "Disponible"
                        ? "Disponible"
                        : "Non disponible"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="trash-button"
                      onClick={() => handleMoveToTrash(material.id)}
                      disabled={!isAdmin}
                      style={{
                        opacity: isAdmin ? 1 : 0.5,
                        cursor: isAdmin ? "pointer" : "not-allowed",
                      }}
                      aria-label={`Mettre ${material.nom} dans la corbeille`}
                      title={
                        isAdmin ? "Supprimer" : "Seul un admin peut supprimer"
                      }
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
          {filteredMaterials.length === 0 && (
            <p className="empty-state">Aucun matériel trouvé.</p>
          )}
        </section>

        <section className="trash-section">
          <div className="trash-header">
            <h2>Corbeille</h2>
            <span>{trashMaterials.length}</span>
          </div>

          {trashMaterials.length === 0 ? (
            <p className="empty-state">Aucun matériel dans la corbeille.</p>
          ) : (
            <div className="trash-list">
              {trashMaterials.map((material) =>
                (() => {
                  const deleteInfo = getDeleteInfo(material.deletedAt);

                  return (
                    <div className="trash-row" key={material.id}>
                      <div>
                        <strong>{material.nom}</strong>
                        <span>
                          Quantité: {material.quantite} - {material.etat}
                        </span>
                        <span>
                          {deleteInfo.label} (
                          {formatDeleteDate(deleteInfo.availableAt)})
                        </span>
                      </div>
                      <div className="trash-actions">
                        <button
                          type="button"
                          onClick={() => handleRestore(material.id)}
                          disabled={!isAdmin}
                          style={{
                            opacity: isAdmin ? 1 : 0.5,
                            cursor: isAdmin ? "pointer" : "not-allowed",
                          }}
                          title={
                            isAdmin
                              ? "Restaurer"
                              : "Seul un admin peut restaurer"
                          }
                        >
                          Restaurer
                        </button>
                        <button
                          type="button"
                          disabled={!deleteInfo.canDelete || !isAdmin}
                          style={{
                            opacity:
                              !deleteInfo.canDelete || !isAdmin ? 0.5 : 1,
                            cursor:
                              !deleteInfo.canDelete || !isAdmin
                                ? "not-allowed"
                                : "pointer",
                          }}
                          onClick={() => handleDeleteForever(material.id)}
                          title={
                            !isAdmin
                              ? "Seul un admin peut supprimer"
                              : !deleteInfo.canDelete
                                ? "Veuillez attendre"
                                : "Supprimer définitivement"
                          }
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })(),
              )}
            </div>
          )}
        </section>
      </main>

      <VehicleModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="modal-title-row">
            <span className="modal-vehicle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16v5H4V5Zm1 7h14v7H5v-7Zm3 2v3h8v-3H8Z" />
              </svg>
            </span>
            <h2 id="vehicle-modal-title">Ajouter matériel</h2>
          </div>

          <label>
            Nom
            <input
              value={form.nom}
              onChange={(event) => updateField("nom", event.target.value)}
            />
          </label>

          <label>
            Quantité
            <input
              type="number"
              min="1"
              value={form.quantite}
              onChange={(event) => updateField("quantite", event.target.value)}
            />
          </label>

          <label>
            État
            <select
              value={form.etat}
              onChange={(event) => updateField("etat", event.target.value)}
            >
              <option>Bon</option>
              <option>Endommagé</option>
              <option>Entretien</option>
            </select>
          </label>

          <label>
            Disponibilité
            <select
              value={form.disponibilite}
              onChange={(event) =>
                updateField("disponibilite", event.target.value)
              }
            >
              <option>Disponible</option>
              <option>Non disponible</option>
            </select>
          </label>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </VehicleModal>
    </div>
  );
}
