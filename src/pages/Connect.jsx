import { useState } from "react";
import { loginUser } from "../database";
import heroImage from "../assets/voiture5.webp";

export default function Connect({
  currentUser,
  onConnect,
  onRegister,
  onAdmin,
  onLogin,
}) {
  const [showReset, setShowReset] = useState(false);
  const [form, setForm] = useState({
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

    if (!form.email.trim() || !form.password.trim()) {
      setMessage("Remplis email et mot de passe.");
      return;
    }

    if (form.role === "Admin" && !form.adminPassword.trim()) {
      setMessage("Veuillez entrer le mot de passe administrateur.");
      return;
    }

    const result = loginUser(
      form.email,
      form.password,
      form.role === "Admin" ? form.adminPassword : null,
    );

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    onLogin(result.user);
  }

  return (
    <div className="auth-container">
      <main className="auth-main">
        <section className="auth-area" id="connexion">
          <img
            src={heroImage}
            alt="Gestion de flotte FleetManager"
            className="auth-hero"
          />
          <h1>FleetManager</h1>

          <form className="login-card" onSubmit={handleSubmit}>
            <h2>CONNEXION</h2>

            <div className="field-stack">
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

              <input
                type="text"
                placeholder="Email, ou Téléphone"
                aria-label="Email ou téléphone"
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

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" />
                <span>Souviens-toi de moi</span>
              </label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => setShowReset(!showReset)}
              >
                Mot de pass oublié ?
              </button>
            </div>

            {showReset && (
              <div className="reset-box">
                <p>Entre ton email pour recevoir un lien de récupération.</p>
                <div className="reset-actions">
                  <input
                    type="email"
                    placeholder="Votre email"
                    aria-label="Email de récupération"
                  />
                  <button type="button">Envoyer</button>
                </div>
              </div>
            )}

            <button type="submit" className="primary-button">
              SE CONNECTER
            </button>

            {message && <p className="form-message">{message}</p>}

            <p className="signup-text">
              Pas encore de compte?{" "}
              <button type="button" onClick={onRegister}>
                Créer un nouveau compte
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
