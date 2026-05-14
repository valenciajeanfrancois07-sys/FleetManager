import { useEffect, useState, useMemo } from "react";
import Button from "../components/Button";
import UserSidebar from "../components/UserSidebar";
import StatusBadge from "../components/StatusBadge";
import { getVehicles, getMaterials, getHistory } from "../database";
import dashboardBanner from "../assets/voiture6.jpg";
import gallery1 from "../assets/voiture1.avif";
import gallery2 from "../assets/voiture2.avif";
import gallery3 from "../assets/voiture3.avif";
import gallery4 from "../assets/voiture5.webp";
import gallery5 from "../assets/Lanborghini.webp";
import gallery6 from "../assets/Subacu.avif";

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
];

const defaultGalleryItems = [
  {
    brand: "Mercedes-Benz",
    model: "E-Class",
    year: 2023,
    category: "Berline premium",
    status: "Bon",
    availability: "Disponible",
    registration: "CA-123-DB",
    driver: "Inconnu",
    description:
      "Accédez à un aperçu clair des véhicules et de leur état en un clin d’œil.",
    image: gallery1,
  },
  {
    brand: "BMW",
    model: "Série 5",
    year: 2022,
    category: "Berline exécutive",
    status: "Bon",
    availability: "Disponible",
    registration: "DB-456-EF",
    driver: "Inconnu",
    description:
      "Présentez un parc professionnel et bien organisé à vos équipes.",
    image: gallery2,
  },
  {
    brand: "Audi",
    model: "A6",
    year: 2024,
    category: "Berline haut de gamme",
    status: "Bon",
    availability: "Non disponible",
    registration: "EF-789-GH",
    driver: "Inconnu",
    description:
      "Visualisez l’état et la disponibilité de chaque matériel avec facilité.",
    image: gallery3,
  },
  {
    brand: "Tesla",
    model: "Model S",
    year: 2025,
    category: "Électrique luxe",
    status: "Bon",
    availability: "Disponible",
    registration: "GH-012-IJ",
    driver: "Inconnu",
    description: "Une interface plus premium avec des images de haute qualité.",
    image: gallery4,
  },
  {
    brand: "Lamborghini",
    model: "Huracán",
    year: 2021,
    category: "Sportive",
    status: "Entretien",
    availability: "Non disponible",
    registration: "IJ-345-KL",
    driver: "Inconnu",
    description:
      "Un ajout dynamique pour montrer les modèles sportifs de votre flotte.",
    image: gallery5,
  },
  {
    brand: "Subaru",
    model: "Outback",
    year: 2020,
    category: "SUV",
    status: "Bon",
    availability: "Disponible",
    registration: "KL-678-MN",
    driver: "Inconnu",
    description:
      "Montrez une voiture robuste et fiable pour les longues distances.",
    image: gallery6,
  },
];

export default function Dashboard({ user, onNavigate, onLogout }) {
  const [vehicles, setVehicles] = useState(() => getVehicles());
  const [materials, setMaterials] = useState(() => getMaterials());
  const [history, setHistory] = useState(() => getHistory());

  const displayName = user?.nom || "Admin";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  const galleryItems = useMemo(() => {
    if (vehicles.length === 0) {
      return defaultGalleryItems;
    }

    return vehicles.map((vehicle, index) => ({
      brand: vehicle.nom || "Véhicule",
      model: vehicle.modele || "Modèle inconnu",
      year: Number(vehicle.annee) || 0,
      labelYear: vehicle.annee || "N/A",
      category: vehicle.categorie || "Flotte",
      status: vehicle.etat || "N/A",
      availability: vehicle.disponibilite || "N/A",
      registration: vehicle.immatriculation || "N/A",
      driver: vehicle.conducteur || "Non assigné",
      description:
        vehicle.description ||
        `Immatriculation ${vehicle.immatriculation || "N/A"} • Conducteur ${vehicle.conducteur || "Non assigné"}`,
      image: galleryImages[index % galleryImages.length],
    }));
  }, [vehicles]);

  const galleryYears = useMemo(
    () => galleryItems.map((item) => Number(item.year) || 0),
    [galleryItems],
  );

  const newestYear = useMemo(() => Math.max(...galleryYears), [galleryYears]);
  const oldestYear = useMemo(() => Math.min(...galleryYears), [galleryYears]);
  const sortedGalleryItems = useMemo(
    () => [...galleryItems].sort((a, b) => b.year - a.year),
    [galleryItems],
  );

  const statCards = useMemo(() => {
    const vehiclesBon = vehicles.filter((v) => v.etat === "Bon").length;
    const materialsBon = materials.filter((m) => m.etat === "Bon").length;
    const enUtilisation =
      vehicles.filter((v) => v.disponibilite === "Disponible").length +
      materials.filter((m) => m.disponibilite === "Disponible").length;
    const horsService =
      vehicles.filter((v) => v.etat !== "Bon").length +
      materials.filter((m) => m.etat !== "Bon").length;

    return [
      {
        title: "Véhicules",
        value: vehicles.length.toString(),
        subtitle: `${vehiclesBon} actifs`,
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 11 7 6h10l2 5h1a1 1 0 0 1 1 1v5h-2v2h-3v-2H8v2H5v-2H3v-5a1 1 0 0 1 1-1h1Zm2.2 0h9.6l-1.2-3H8.4l-1.2 3ZM7 15.4A1.4 1.4 0 1 0 7 12.6a1.4 1.4 0 0 0 0 2.8Zm10 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" />
          </svg>
        ),
      },
      {
        title: "Matériels",
        value: materials.length.toString(),
        subtitle: `${materialsBon} disponibles`,
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16v5H4V5Zm1 7h14v7H5v-7Zm3 2v3h8v-3H8Z" />
          </svg>
        ),
      },
      {
        title: "En utilisation",
        value: enUtilisation.toString(),
        subtitle: `${vehicles.filter((v) => v.disponibilite === "Disponible").length} véhicules`,
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4a8 8 0 0 1 7.7 5.8l1.5-1.5L22.6 9.7 19 13.3l-3.6-3.6 1.4-1.4 1 1A6 6 0 0 0 6.7 8L5 7a8 8 0 0 1 7-3Zm-7.7 10.2-1.5 1.5L1.4 14.3 5 10.7l3.6 3.6-1.4 1.4-1-1A6 6 0 0 0 17.3 16l1.7 1a8 8 0 0 1-14.7-2.8Z" />
          </svg>
        ),
      },
      {
        title: "Hors service",
        value: horsService.toString(),
        subtitle: `${vehicles.filter((v) => v.etat === "Entretien").length + materials.filter((m) => m.etat === "Entretien").length} en maintenance`,
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2 2 20h20L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V8h2v5Z" />
          </svg>
        ),
      },
    ];
  }, [vehicles, materials]);

  const activities = useMemo(() => {
    return history.slice(0, 5).map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      action: entry.vehicle,
      etat: entry.action.includes("État")
        ? entry.action.split(" -> ")[1] || "Bon"
        : "Bon",
      disponibilite: entry.action.includes("Disponibilité")
        ? entry.action.includes("Disponible")
          ? "Disponible"
          : "Non disponible"
        : entry.action.includes("Ajouté")
          ? "Disponible"
          : "Non disponible",
    }));
  }, [history]);

  return (
    <div className="dashboard-shell vehicles-shell">
      <UserSidebar
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="dashboard"
      />

      <main className="dashboard-main vehicles-main">
        <section className="dashboard-banner-card">
          <img
            src={dashboardBanner}
            alt="Tableau de bord FleetManager"
            className="dashboard-banner"
          />
          <div className="dashboard-banner-copy">
            <p>
              Un tableau de bord moderne pour piloter votre flotte en toute
              confiance.
            </p>
          </div>
        </section>

        <header className="dashboard-topbar">
          <h1>Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="dashboard-avatar" aria-hidden="true">
              {initial}
            </span>
            <span>Salut {displayName}</span>
          </div>
        </header>

        <section className="dashboard-stats" aria-label="Statistiques">
          {statCards.map((card) => (
            <article className="dashboard-stat-card" key={card.title}>
              <div className="dashboard-stat-icon">{card.icon}</div>
              <div>
                <h2>{card.title}</h2>
                <strong>{card.value}</strong>
                <span>{card.subtitle}</span>
              </div>
            </article>
          ))}
        </section>

        <section
          className="dashboard-gallery"
          aria-label="Galerie FleetManager"
        >
          <div className="dashboard-gallery-header">
            <h2>Galerie de la flotte</h2>
          </div>
          <div className="dashboard-gallery-grid">
            {sortedGalleryItems.map((item) => {
              const badge =
                item.year === newestYear
                  ? "Nouveau"
                  : item.year === oldestYear
                    ? "Ancien"
                    : null;
              return (
                <article
                  className="gallery-card"
                  key={`${item.brand}-${item.model}-${item.year}`}
                >
                  <img
                    src={item.image}
                    alt={`${item.brand} ${item.model} ${item.year}`}
                  />
                  <div className="gallery-card-content">
                    <div className="gallery-card-title-row">
                      <div>
                        <h3>
                          {item.brand} {item.model}
                        </h3>
                        <span className="gallery-card-category">
                          {item.category}
                        </span>
                      </div>
                      <span className="gallery-card-year">
                        {item.labelYear || item.year}
                      </span>
                    </div>
                    {badge && (
                      <span
                        className={`gallery-card-badge ${badge === "Nouveau" ? "badge-new" : "badge-old"}`}
                      >
                        {badge}
                      </span>
                    )}
                    <div className="gallery-card-meta">
                      <span>{item.status}</span>
                      <span>{item.availability}</span>
                      <span>{item.registration}</span>
                      <span>{item.driver}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dashboard-activity-card">
          <div className="dashboard-card-header">
            <h2>Activités récentes</h2>
            <Button variant="primary" onClick={() => onNavigate("vehicules")}>
              <span aria-hidden="true" className="plus-icon">
                +
              </span>
              Véhicules
            </Button>
          </div>

          <table className="vehicle-table dashboard-activity-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Etat</th>
                <th>Disponibilité</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={`${activity.date}-${activity.action}`}>
                  <td>{activity.date}</td>
                  <td>{activity.action}</td>
                  <td>{activity.etat}</td>
                  <td>
                    <StatusBadge value={activity.disponibilite} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="row-dropdown"
                      aria-label={`Options ${activity.action}`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m7 10 5 5 5-5H7Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          className="dashboard-chart-card"
          aria-label="Diagramme de cas d'utilisation FleetManager"
        >
          <h2
            style={{
              fontSize: "1.2rem",
              marginBottom: "1.5rem",
              color: "#333",
              textAlign: "center",
            }}
          >
            Diagramme de cas d'utilisation - FleetManager
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              backgroundColor: "#f8f9fa",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              padding: "2rem",
              position: "relative",
            }}
          >
            {/* Système central */}
            <div
              style={{
                width: "200px",
                height: "120px",
                backgroundColor: "#007bff",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              FleetManager
            </div>

            {/* Acteur Administrateur */}
            <div
              style={{
                position: "absolute",
                left: "50px",
                top: "50px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#28c76f",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  margin: "0 auto 8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Admin
              </div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                Administrateur
              </div>
            </div>

            {/* Acteur Utilisateur */}
            <div
              style={{
                position: "absolute",
                right: "50px",
                top: "50px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#ffcc4d",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  margin: "0 auto 8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                User
              </div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                Utilisateur
              </div>
            </div>

            {/* Cas d'utilisation - Cercles autour du système */}
            {/* Consulter les véhicules */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "20px",
                transform: "translateX(-50%)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#6fb6ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Consulter
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Véhicules</div>
            </div>

            {/* Ajouter un véhicule */}
            <div
              style={{
                position: "absolute",
                left: "150px",
                top: "120px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#28c76f",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Ajouter
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Véhicule</div>
            </div>

            {/* Modifier un véhicule */}
            <div
              style={{
                position: "absolute",
                right: "150px",
                top: "120px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#ff8a3d",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Modifier
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Véhicule</div>
            </div>

            {/* Supprimer un véhicule */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "20px",
                transform: "translateX(-50%)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#ea5455",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Supprimer
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Véhicule</div>
            </div>

            {/* Vérifier l'état */}
            <div
              style={{
                position: "absolute",
                left: "100px",
                bottom: "80px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#9f1d35",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                État
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Vérifier</div>
            </div>

            {/* Gérer la maintenance */}
            <div
              style={{
                position: "absolute",
                right: "100px",
                bottom: "80px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#6c757d",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Maintenance
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>Gérer</div>
            </div>

            {/* Faire une demande */}
            <div
              style={{
                position: "absolute",
                right: "50px",
                bottom: "150px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#17a2b8",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Demande
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>
                Utilisation
              </div>
            </div>

            {/* Approuver/Refuser */}
            <div
              style={{
                position: "absolute",
                left: "50px",
                bottom: "150px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#6610f2",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  margin: "0 auto 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Approuver
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>
                Approuver/Refuser
              </div>
            </div>

            {/* Lignes de connexion (simplifiées) */}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {/* Lignes de l'Administrateur au système */}
              <line
                x1="130"
                y1="90"
                x2="350"
                y2="200"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="130"
                y1="90"
                x2="250"
                y2="140"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="130"
                y1="90"
                x2="450"
                y2="140"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="130"
                y1="90"
                x2="350"
                y2="280"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="130"
                y1="90"
                x2="250"
                y2="240"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="130"
                y1="90"
                x2="450"
                y2="240"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="130"
                y1="90"
                x2="150"
                y2="200"
                stroke="#28c76f"
                strokeWidth="2"
                opacity="0.3"
              />

              {/* Lignes de l'Utilisateur au système */}
              <line
                x1="570"
                y1="90"
                x2="350"
                y2="200"
                stroke="#ffcc4d"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="570"
                y1="90"
                x2="550"
                y2="200"
                stroke="#ffcc4d"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Légende */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                marginBottom: "0.8rem",
                color: "#333",
              }}
            >
              Légende
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "0.5rem",
                fontSize: "0.8rem",
                color: "#666",
              }}
            >
              <div>
                <strong style={{ color: "#28c76f" }}>Administrateur:</strong>{" "}
                Gestion complète du système
              </div>
              <div>
                <strong style={{ color: "#ffcc4d" }}>Utilisateur:</strong>{" "}
                Consultation et demandes
              </div>
              <div>
                <strong>Actions principales:</strong> Consulter, Ajouter,
                Modifier, Supprimer
              </div>
              <div>
                <strong>Actions avancées:</strong> Maintenance, Demandes,
                Approbations
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
