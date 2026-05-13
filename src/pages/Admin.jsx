import { useEffect, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import UserSidebar from "../components/UserSidebar";
import AuthSidebar from "../components/AuthSidebar";
import {
  deleteUser,
  deleteVehicle,
  getHistory,
  getMaterials,
  getTrashHistory,
  getTrashMaterials,
  getTrashVehicles,
  getUsers,
  getVehicles,
  saveHistory,
  saveTrashVehicles,
  saveUsers,
  saveVehicles,
} from "../database";
import { formatDeleteDate, getDeleteInfo } from "../utils/trashDelay";
import adminHero from "../assets/voiture1.avif";
import adminBanner from "../assets/voiture2.avif";

const ADMIN_PASSWORD = "thebestfleetmanagerservice";

export default function Admin({
  user,
  onNavigate,
  onConnect,
  onRegister,
  isUnlocked,
  onUnlock,
  onLogout,
}) {
  console.log("Admin component rendered, isUnlocked:", isUnlocked);
  console.log("Admin props:", {
    user,
    onNavigate,
    onConnect,
    onRegister,
    isUnlocked,
    onUnlock,
    onLogout,
  });
  console.log("Admin component starting...");
  const [users, setUsers] = useState(() => getUsers());
  const [vehicles, setVehicles] = useState(() => getVehicles());
  const [trashVehicles] = useState(() => getTrashVehicles());
  const [materials] = useState(() => getMaterials());
  const [trashMaterials] = useState(() => getTrashMaterials());

  const [history, setHistory] = useState(() => {
    const hist = getHistory();

    if (hist.length === 0) {
      const testEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        action: "Test - Système initialisé",
        vehicle: "Système",
        user: "Admin Test",
        timestamp: new Date().toISOString(),
      };
      hist.unshift(testEntry);
      saveHistory(hist);
    }
    return hist;
  });

  const [trashHistory] = useState(() => getTrashHistory());
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // Récupérer le nom de l'admin depuis le localStorage s'il est connecté
  const getAdminDisplayName = () => {
    if (isUnlocked) {
      const adminData = localStorage.getItem("fleetmanager_admin_session");
      if (adminData) {
        const admin = JSON.parse(adminData);
        return admin.name || adminName.trim() || "Admin";
      }
    }
    return adminName.trim() || user?.nom || "Admin";
  };

  const sidebarUser = {
    nom: getAdminDisplayName(),
    role: isUnlocked ? "Admin" : user?.role || "Utilisateur",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveVehicles(vehicles);
  }, [vehicles]);

  function handleDeleteVehicle(vehicleId) {
    setVehicles(deleteVehicle(vehicleId));
  }

  function handleDeleteUser(userId) {
    setUsers(deleteUser(userId));
  }

  function handleEditUser(userId) {
    const userToEdit = users.find((u) => u.id === userId);
    setEditingUser(userToEdit);
  }

  function handleSaveUser() {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    }
  }

  function handleEditVehicle(vehicleId) {
    const vehicleToEdit = vehicles.find((v) => v.id === vehicleId);
    setEditingVehicle(vehicleToEdit);
  }

  function handleSaveVehicle() {
    if (editingVehicle) {
      setVehicles(
        vehicles.map((v) => (v.id === editingVehicle.id ? editingVehicle : v)),
      );
      setEditingVehicle(null);
    }
  }

  function handleRestoreVehicle(vehicleId) {
    const vehicle = trashVehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      const restoredVehicle = { ...vehicle, deletedAt: undefined };
      setVehicles([...vehicles, restoredVehicle]);

      const newTrash = trashVehicles.filter((v) => v.id !== vehicleId);
      saveTrashVehicles(newTrash);
    }
  }

  function handleAdminSubmit(event) {
    event.preventDefault();

    if (!adminName.trim()) {
      setMessage("Entre le nom admin.");
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setMessage("");
      // Sauvegarder le nom de l'admin dans le localStorage pour le garder dans le menu
      localStorage.setItem(
        "fleetmanager_admin_session",
        JSON.stringify({
          name: adminName.trim(),
          timestamp: new Date().toISOString(),
        }),
      );
      onUnlock();
      return;
    }

    setMessage("Mot de passe admin incorrect.");
  }

  const filteredUsers = users.filter(
    (user) =>
      (user.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (vehicle.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vehicle.etat?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vehicle.disponibilite?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ),
  );

  const filteredHistory = history.filter(
    (entry) =>
      (entry.vehicle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (entry.action?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (entry.user?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  if (!isUnlocked) {
    return (
      <div className="fleet-shell">
        <input
          className="menu-toggle"
          type="checkbox"
          id="admin-menu-toggle"
          aria-label="Ouvrir le menu"
        />
        <label
          className="hamburger"
          htmlFor="admin-menu-toggle"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </label>

        <AuthSidebar
          onConnect={onConnect}
          onRegister={onRegister}
          onAdmin={() => onNavigate("admin")}
        />

        <main className="main-panel admin-lock-main">
          <form className="admin-lock-card" onSubmit={handleAdminSubmit}>
            <img
              src={adminHero}
              alt="Administration FleetManager"
              className="admin-hero"
            />
            <h1>Connexion Admin</h1>
            <p>Entre le mot de passe admin pour accéder au contrôle complet.</p>
            <input
              type="text"
              placeholder="Nom admin"
              value={adminName}
              onChange={(event) => {
                setAdminName(event.target.value);
                setMessage("");
              }}
              aria-label="Nom admin"
            />
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setMessage("");
              }}
              aria-label="Mot de passe admin"
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Entrer
            </button>
            {message && <span className="form-message">{message}</span>}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell admin-shell">
      <UserSidebar
        user={sidebarUser}
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="admin"
      />

      <main className="vehicles-main admin-main admin-main">
        <Header title="Admin" />

        <section className="admin-stats">
          <article>
            <span>Utilisateurs</span>
            <strong>{users.length}</strong>
          </article>
          <article>
            <span>Véhicules</span>
            <strong>{vehicles.length}</strong>
          </article>
          <article>
            <span>Données supprimées</span>
            <strong>
              {trashVehicles.length +
                trashMaterials.length +
                trashHistory.length}
            </strong>
          </article>
        </section>

        {/* Barre de recherche et filtres */}
        <section className="admin-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: "300px",
                fontSize: "14px",
              }}
            />
          </div>
          <div className="filter-buttons">
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              style={{
                padding: "8px 16px",
                backgroundColor: showDeleted ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
              }}
            >
              {showDeleted ? "Masquer" : "Voir"} Supprimés
            </button>
          </div>
        </section>

        <section className="admin-grid">
          <div className="admin-panel">
            <h2>Utilisateurs</h2>
            {users.length === 0 ? (
              <p className="empty-state">Aucun utilisateur.</p>
            ) : (
              <div className="admin-list">
                {filteredUsers.map((currentUser) => (
                  <div className="admin-list-row" key={currentUser.id}>
                    <div>
                      <strong>{currentUser.nom}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleEditUser(currentUser.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(currentUser.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire d'édition d'utilisateur */}
            {editingUser && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3>Modifier l'utilisateur</h3>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Nom:
                  </label>
                  <input
                    type="text"
                    value={editingUser.nom}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, nom: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Email:
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleSaveUser}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Véhicules actifs</h2>
            {vehicles.length === 0 ? (
              <p className="empty-state">Aucun véhicule.</p>
            ) : (
              <div className="admin-list">
                {filteredVehicles.map((vehicle) => (
                  <div className="admin-list-row" key={vehicle.id}>
                    <div>
                      <strong>{vehicle.nom}</strong>
                      <span>
                        {vehicle.etat} - {vehicle.disponibilite}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleEditVehicle(vehicle.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire d'édition de véhicule */}
            {editingVehicle && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3>Modifier le véhicule</h3>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Nom:
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.nom}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        nom: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    État:
                  </label>
                  <select
                    value={editingVehicle.etat}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        etat: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="Bon">Bon</option>
                    <option value="En panne">En panne</option>
                    <option value="Entretien">Entretien</option>
                  </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Disponibilité:
                  </label>
                  <select
                    value={editingVehicle.disponibilite}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        disponibilite: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Non disponible">Non disponible</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleSaveVehicle}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingVehicle(null)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section des éléments supprimés */}
          {showDeleted && (
            <div className="admin-panel">
              <h2>Véhicules supprimés</h2>
              {trashVehicles.length === 0 ? (
                <p className="empty-state">Aucun véhicule supprimé.</p>
              ) : (
                <div className="admin-list">
                  {trashVehicles.map((vehicle) => (
                    <div className="admin-list-row" key={vehicle.id}>
                      <div>
                        <strong>{vehicle.nom}</strong>
                        <span>
                          {vehicle.etat} - {vehicle.disponibilite}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#666" }}>
                          {getDeleteInfo(vehicle.deletedAt).label} (
                          {formatDeleteDate(
                            getDeleteInfo(vehicle.deletedAt).availableAt,
                          )}
                          )
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRestoreVehicle(vehicle.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#17a2b8",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Restaurer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="admin-panel">
            <h2>Historiques des travaux</h2>
            {history.length === 0 ? (
              <p className="empty-state">Aucun historique.</p>
            ) : (
              <div className="admin-list">
                {filteredHistory.map((entry) => (
                  <div className="admin-list-row" key={entry.id}>
                    <div>
                      <strong>{entry.vehicle}</strong>
                      <span>{entry.action}</span>
                      <span style={{ color: "#007bff", fontWeight: "bold" }}>
                        Par: {entry.user || user?.nom || "Utilisateur inconnu"}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#666" }}>
                        {new Date(entry.date).toLocaleString("fr-FR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
