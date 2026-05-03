import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import { getHistory, getTrashHistory, saveHistory, saveTrashHistory } from '../database';
import { formatDeleteDate, getDeleteInfo } from '../utils/trashDelay';

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getDateInputValue(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export default function Historiques({ user, onNavigate, onLogout }) {
  const [history, setHistory] = useState(() => getHistory());
  const [trashHistory, setTrashHistory] = useState(() => getTrashHistory());
  const [dateSearch, setDateSearch] = useState('');

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveTrashHistory(trashHistory);
  }, [trashHistory]);

  const filteredHistory = useMemo(() => {
    // Filtrer par utilisateur si ce n'est pas un Admin
    let historyToShow = history;
    if (!user?.role || user?.role !== 'Admin') {
      const userName = user?.nom || user?.email || 'Utilisateur inconnu';
      console.log('Debug - userName:', userName);
      console.log('Debug - history entries:', history);
      console.log('Debug - user object:', user);
      
      historyToShow = history.filter((entry) => {
        const matches = entry.user === userName;
        console.log('Debug - entry.user:', entry.user, 'matches:', matches);
        return matches;
      });
      
      console.log('Debug - filtered history:', historyToShow);
    }
    
    if (!dateSearch) return historyToShow;
    return historyToShow.filter((entry) => getDateInputValue(entry.date) === dateSearch);
  }, [dateSearch, history, user]);

  function handleMoveToTrash(entryId) {
    const entryToTrash = history.find((entry) => entry.id === entryId);
    if (!entryToTrash) return;

    // Vérifier si l'historique appartient à l'utilisateur actuel ou si c'est un Admin
    const isOwnEntry = entryToTrash.user === user?.nom;
    
    if (!isOwnEntry && (!user?.role || user?.role !== 'Admin')) {
      alert('Vous ne pouvez supprimer que vos propres historiques.');
      return;
    }

    setHistory((currentHistory) => currentHistory.filter((entry) => entry.id !== entryId));
    setTrashHistory((currentTrash) => [
      {
        ...entryToTrash,
        deletedAt: new Date().toISOString(),
      },
      ...currentTrash,
    ]);
  }

  function handleRestore(entryId) {
    const entryToRestore = trashHistory.find((entry) => entry.id === entryId);
    if (!entryToRestore) return;

    // Vérifier si l'historique appartient à l'utilisateur actuel ou si c'est un Admin
    const isOwnEntry = entryToRestore.user === user?.nom;
    
    if (!isOwnEntry && (!user?.role || user?.role !== 'Admin')) {
      alert('Vous ne pouvez restaurer que vos propres historiques.');
      return;
    }

    const { deletedAt, ...restoredEntry } = entryToRestore;
    setTrashHistory((currentTrash) => currentTrash.filter((entry) => entry.id !== entryId));
    setHistory((currentHistory) => [restoredEntry, ...currentHistory]);
  }

  function handleDeleteForever(entryId) {
    const entryToDelete = trashHistory.find((entry) => entry.id === entryId);
    if (!entryToDelete || !getDeleteInfo(entryToDelete.deletedAt).canDelete) return;

    setTrashHistory((currentTrash) => currentTrash.filter((entry) => entry.id !== entryId));
  }

  return (
    <div className="dashboard-shell historiques-shell">
      <UserSidebar user={user} onNavigate={onNavigate} onLogout={onLogout} activePage="historique" />

      <main className="vehicles-main historiques-main">
        <Header title="Historiques" />

        <label className="history-search">
          <span>Recherche Date</span>
          <input
            type="date"
            value={dateSearch}
            onChange={(event) => setDateSearch(event.target.value)}
            aria-label="Recherche Date"
          />
        </label>

        <section className="vehicle-table-card" aria-label="Historique des véhicules">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Véhicule</th>
                <th>Action</th>
                <th>Corbeille</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.vehicle}</td>
                  <td>{entry.action}</td>
                  <td>
                    <button
                      type="button"
                      className="trash-button"
                      onClick={() => handleMoveToTrash(entry.id)}
                      aria-label="Mettre cet historique dans la corbeille"
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
          {filteredHistory.length === 0 && <p className="empty-state">Aucun historique trouvé.</p>}
        </section>

        <section className="trash-section">
          <div className="trash-header">
            <h2>Corbeille</h2>
            <span>{trashHistory.length}</span>
          </div>

          {trashHistory.length === 0 ? (
            <p className="empty-state">Aucun historique dans la corbeille.</p>
          ) : (
            <div className="trash-list">
              {trashHistory.map((entry) => (
                (() => {
                  const deleteInfo = getDeleteInfo(entry.deletedAt);

                  return (
                    <div className="trash-row" key={entry.id}>
                      <div>
                        <strong>{entry.vehicle}</strong>
                        <span>{formatDate(entry.date)} - {entry.action}</span>
                        <span>{deleteInfo.label} ({formatDeleteDate(deleteInfo.availableAt)})</span>
                      </div>
                      <div className="trash-actions">
                        <button type="button" onClick={() => handleRestore(entry.id)}>
                          Restaurer
                        </button>
                        <button
                          type="button"
                          disabled={!deleteInfo.canDelete}
                          onClick={() => handleDeleteForever(entry.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })()
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
