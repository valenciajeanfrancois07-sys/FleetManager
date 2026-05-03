// Format the deletion date for display
export function formatDeleteDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get deletion info based on trash date
export function getDeleteInfo(trashDate) {
  if (!trashDate) return null;
  
  const trash = new Date(trashDate);
  const now = new Date();
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const deleteDate = new Date(trash.getTime() + thirtyDaysInMs);
  const daysRemaining = Math.ceil((deleteDate - now) / (24 * 60 * 60 * 1000));
  
  return {
    deleteDate,
    daysRemaining: Math.max(0, daysRemaining),
    willDeleteOn: formatDeleteDate(deleteDate),
    isExpired: daysRemaining <= 0
  };
}
