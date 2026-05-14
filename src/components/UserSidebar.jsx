const menuItems = [
  {
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z" />
      </svg>
    ),
  },
  {
    label: "Véhicules",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 11 7 6h10l2 5h1a1 1 0 0 1 1 1v5h-2v2h-3v-2H8v2H5v-2H3v-5a1 1 0 0 1 1-1h1Zm2.2 0h9.6l-1.2-3H8.4l-1.2 3ZM7 15.4A1.4 1.4 0 1 0 7 12.6a1.4 1.4 0 0 0 0 2.8Zm10 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" />
      </svg>
    ),
  },
  {
    label: "Matériels",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v5H4V5Zm1 7h14v7H5v-7Zm3 2v3h8v-3H8Z" />
      </svg>
    ),
  },
  {
    label: "Historique",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4a8 8 0 1 1-7.45 5.1H2l3.6-3.6L9.2 9.1H6.75A6 6 0 1 0 12 6v4l3 2-1 1.7-4-2.7V4h2Z" />
      </svg>
    ),
  },
  {
    label: "Admin",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
  },
];

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="brand-icon">
      <path d="M5 11 7.25 6h9.5L19 11h1a1 1 0 0 1 1 1v5h-2v2h-3v-2H8v2H5v-2H3v-5a1 1 0 0 1 1-1h1Zm2.2 0h9.6l-1.35-3H8.55L7.2 11ZM7 15.4A1.4 1.4 0 1 0 7 12.6a1.4 1.4 0 0 0 0 2.8Zm10 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" />
    </svg>
  );
}

export default function UserSidebar({
  user,
  onNavigate,
  onLogout,
  activePage,
}) {
  const displayName = user?.nom || "Admin";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  return (
    <aside className="fleet-sidebar">
      <div className="brand">
        <CarIcon />
        <span>FleetManager</span>
      </div>

      <nav className="sidebar-nav" aria-label="Menu principal">
        {menuItems
          .filter((item) => {
            // Cacher le lien Admin pour les utilisateurs non-admin
            if (item.label === "Admin") {
              return user?.role === "Admin";
            }
            return true;
          })
          .map((item) => (
            <button
              type="button"
              className={`nav-link ${
                activePage === "vehicules" &&
                item.label.toLowerCase() === "véhicules"
                  ? "active"
                  : activePage === "materiels" &&
                      item.label.toLowerCase() === "matériels"
                    ? "active"
                    : activePage === "historiques" &&
                        item.label.toLowerCase() === "historique"
                      ? "active"
                      : activePage === item.label.toLowerCase()
                        ? "active"
                        : ""
              }`}
              key={item.label}
              onClick={() => {
              if (item.label === "Admin" && (!user || user.role !== "Admin")) {
                alert("Accès administrateur refusé. Vous n'avez pas les permissions nécessaires.");
                return;
              }
              onNavigate &&
                onNavigate(
                  item.label.toLowerCase() === "véhicules"
                    ? "vehicules"
                    : item.label.toLowerCase() === "matériels"
                      ? "materiels"
                      : item.label.toLowerCase() === "historique"
                        ? "historiques"
                        : item.label.toLowerCase(),
                );
            }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
      </nav>

      <div className="user-info">
        <div className="user-avatar">
          <span>{initial}</span>
        </div>
        <div className="user-details">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="user-name">{displayName}</span>
            <button
              type="button"
              onClick={onLogout}
              title="Se déconnecter"
              style={{
                background: "#dc3545",
                border: "2px solid #dc3545",
                cursor: "pointer",
                padding: "0.4rem",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                color: "white",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(220, 53, 69, 0.3)",
                transform: "scale(1.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#c82333";
                e.target.style.borderColor = "#c82333";
                e.target.style.transform = "scale(1.2)";
                e.target.style.boxShadow = "0 4px 8px rgba(220, 53, 69, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#dc3545";
                e.target.style.borderColor = "#dc3545";
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = "0 2px 4px rgba(220, 53, 69, 0.3)";
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: "20px", height: "20px" }}
              >
                <path
                  d="M19 12h-6v8H6v-8H0l12-12 12 12zm-6 0h-2v6h2v-6z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <span className="user-role">{user?.role || "Admin"}</span>
        </div>
      </div>
    </aside>
  );
}
