import { useState } from "react";
import { createUser } from "../database";
import registerHero from "../assets/voiture2.avif";

export default function Enregist({ onConnect, onAdmin, onRegisterSuccess }) {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    role: "Employé",
    adminPassword: "",
  });
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.nom.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage("Remplis tous les champs.");
      return;
    }

    if (form.role === "Admin" && !form.adminPassword.trim()) {
      setMessage("Veuillez entrer le mot de passe administrateur.");
      return;
    }

    const result = createUser(form);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    onRegisterSuccess(result.user);
  }

  return (
    <div className="auth-container">
      <main className="auth-main">
        <section className="auth-area register-area">
          <img
            src={registerHero}
            alt="Inscription FleetManager"
            className="auth-hero"
          />
          <h1>FleetManager</h1>

          <form className="login-card register-card" onSubmit={handleSubmit}>
            <h2>INSCRIPTION</h2>
            <div className="field-stack">
              <input
                placeholder="Nom complet"
                aria-label="Nom complet"
                value={form.nom}
                onChange={(event) => updateField("nom", event.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                aria-label="Mot de passe"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
              />
              <select
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                aria-label="Rôle utilisateur"
                className="role-select"
              >
                <option value="Employé">Employé</option>
                <option value="Chauffeur">Chauffeur</option>
                <option value="Mécanicien">Mécanicien</option>
                <option value="Admin">Admin</option>
              </select>
              {form.role === "Admin" && (
                <input
                  type="password"
                  placeholder="Mot de passe administrateur"
                  aria-label="Mot de passe administrateur"
                  value={form.adminPassword}
                  onChange={(event) =>
                    updateField("adminPassword", event.target.value)
                  }
                />
              )}
            </div>
            <button type="submit" className="primary-button">
              CREER UN COMPTE
            </button>
            {message && <p className="form-message">{message}</p>}
            <p className="signup-text">
              Déjà inscrit?{" "}
              <button type="button" onClick={onConnect}>
                Se connecter
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
