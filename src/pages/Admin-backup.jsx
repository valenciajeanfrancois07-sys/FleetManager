import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import AuthSidebar from '../components/AuthSidebar';
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
  saveUsers,
  saveVehicles,
} from '../database';
import { formatDeleteDate, getDeleteInfo } from '../utils/trashDelay';

const ADMIN_PASSWORD = 'thebestfleetmanagerservice';

export default function Admin({ user, onNavigate, onConnect, onRegister, isUnlocked, onUnlock, onLogout }) {
  console.log('Admin component rendered, isUnlocked:', isUnlocked);
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
      action: 'Test - Système initialisé',
      vehicle: 'Système',
      user: 'Admin Test',
      timestamp: new Date().toISOString()
    };
    hist.unshift(testEntry);
    saveHistory(hist);
  }
  return hist;
});
  const [trashHistory] = useState(() => getTrashHistory());
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const sidebarUser = { nom: adminName.trim() || (user?.nom) || 'Admin', role: 'Admin' };

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

  function handleAdminSubmit(event) {
    event.preventDefault();

    if (!adminName.trim()) {
      setMessage('Entre le nom admin.');
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setMessage('');
      onUnlock();
      return;
    }

    setMessage('Mot de passe admin incorrect.');
  }

  if (!isUnlocked) {
    return (
      <div className="fleet-shell">
        <input className="menu-toggle" type="checkbox" id="admin-menu-toggle" aria-label="Ouvrir le menu" />
        <label className="hamburger" htmlFor="admin-menu-toggle" aria-hidden="true">
          <span />
          <span />
          <span />
        </label>

        <AuthSidebar onConnect={onConnect} onRegister={onRegister} onAdmin={() => onNavigate('admin')} />

        <main className="main-panel admin-lock-main">
          <form className="admin-lock-card" onSubmit={handleAdminSubmit}>
            <h1>Connexion Admin</h1>
            <p>Entre le mot de passe admin pour accéder au contrôle complet.</p>
            <input
              type="text"
              placeholder="Nom admin"
              value={adminName}
              onChange={(event) => {
                setAdminName(event.target.value);
                setMessage('');
              }}
              aria-label="Nom admin"
            />
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setMessage('');
              }}
              aria-label="Mot de passe admin"
            />
            <Button variant="primary" type="submit">
              Entrer
            </Button>
            {message && <span className="form-message">{message}</span>}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell admin-shell">
      <UserSidebar user={sidebarUser} onNavigate={onNavigate} onLogout={onLogout} activePage="admin" />

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
            <strong>{trashVehicles.length + trashMaterials.length + trashHistory.length}</strong>
          </article>
        </section>

        <section className="admin-grid">
          <div className="admin-panel">
            <h2>Utilisateurs</h2>
            {users.length === 0 ? (
              <p className="empty-state">Aucun utilisateur.</p>
            ) : (
              <div className="admin-list">
                {users.map((currentUser) => (
                  <div className="admin-list-row" key={currentUser.id}>
                    <div>
                      <strong>{currentUser.nom}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <button type="button" onClick={() => handleDeleteUser(currentUser.id)}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Véhicules actifs</h2>
            {vehicles.length === 0 ? (
              <p className="empty-state">Aucun véhicule.</p>
            ) : (
              <div className="admin-list">
                {vehicles.map((vehicle) => (
                  <div className="admin-list-row" key={vehicle.id}>
                    <div>
                      <strong>{vehicle.nom}</strong>
                      <span>{vehicle.etat} - {vehicle.disponibilite}</span>
                    </div>
                    <button type="button" onClick={() => handleDeleteVehicle(vehicle.id)}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                      <span>{vehicle.etat} - {vehicle.disponibilite}</span>
                      <span>{getDeleteInfo(vehicle.deletedAt).label} ({formatDeleteDate(getDeleteInfo(vehicle.deletedAt).availableAt)})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Matériels actifs</h2>
            {materials.length === 0 ? (
              <p className="empty-state">Aucun matériel.</p>
            ) : (
              <div className="admin-list">
                {materials.map((material) => (
                  <div className="admin-list-row" key={material.id}>
                    <div>
                      <strong>{material.nom}</strong>
                      <span>Quantité: {material.quantite} - {material.etat}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Matériels supprimés</h2>
            {trashMaterials.length === 0 ? (
              <p className="empty-state">Aucun matériel supprimé.</p>
            ) : (
              <div className="admin-list">
                {trashMaterials.map((material) => (
                  <div className="admin-list-row" key={material.id}>
                    <div>
                      <strong>{material.nom}</strong>
                      <span>Quantité: {material.quantite} - {material.etat}</span>
                      <span>{getDeleteInfo(material.deletedAt).label} ({formatDeleteDate(getDeleteInfo(material.deletedAt).availableAt)})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Historiques des travaux</h2>
            {history.length === 0 ? (
              <p className="empty-state">Aucun historique.</p>
            ) : (
              <div className="admin-list">
                {history.map((entry) => (
                  <div className="admin-list-row" key={entry.id}>
                    <div>
                      <strong>{entry.vehicle}</strong>
                      <span>{entry.action}</span>
                      <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                        Par: {entry.user || user?.nom || 'Utilisateur inconnu'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(entry.date).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Historiques supprimés</h2>
            {trashHistory.length === 0 ? (
              <p className="empty-state">Aucun historique supprimé.</p>
            ) : (
              <div className="admin-list">
                {trashHistory.map((entry) => (
                  <div className="admin-list-row" key={entry.id}>
                    <div>
                      <strong>{entry.vehicle}</strong>
                      <span>{entry.action}</span>
                      <span>{getDeleteInfo(entry.deletedAt).label} ({formatDeleteDate(getDeleteInfo(entry.deletedAt).availableAt)})</span>
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