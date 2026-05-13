import { useState } from "react";
import { createUser } from "../database";
import registerHero from "../assets/voiture2.avif";

export default function Enregist({ onConnect, onAdmin, onRegisterSuccess }) {
  const [form, setForm] = useState({ nom: "", email: "", password: "" });
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
