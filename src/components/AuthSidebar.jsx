const menuItems = [
  {
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h6v6H4v-6Zm0-8h6v6H4V5Zm8 0h6v6h-6V5Zm0 8h6v6h-6v-6Z" />
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

export default function AuthSidebar({
  onConnect,
  onRegister,
  onAdmin,
  onNavigate,
  activePage,
}) {
  return (
    <aside className="fleet-sidebar">
      <div className="brand">
        <CarIcon />
        <span>FleetManager</span>
      </div>

      <nav className="sidebar-nav" aria-label="Menu principal">
        {menuItems.map((item) => (
          <button
            type="button"
            className={`nav-link ${activePage === item.label.toLowerCase() ? "active" : ""}`}
            key={item.label}
            onClick={() => onNavigate && onNavigate(item.label.toLowerCase())}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-actions">
        <button
          type="button"
          className="sidebar-button login-link"
          onClick={onConnect}
        >
          Se connecter
        </button>
        <button
          type="button"
          className="sidebar-button register-link"
          onClick={onRegister}
        >
          S'enregistrer
        </button>
        <button
          type="button"
          className="sidebar-button admin-link"
          onClick={onAdmin}
        >
          Admin
        </button>
      </div>
    </aside>
  );
}
