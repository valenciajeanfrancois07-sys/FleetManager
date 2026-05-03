import { useState } from 'react';
import AuthSidebar from '../components/AuthSidebar';
import { loginUser } from '../database';

export default function Connect({ onConnect, onRegister, onAdmin, onLogin }) {
  const [showReset, setShowReset] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setMessage('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setMessage('Remplis email et mot de passe.');
      return;
    }

    const result = loginUser(form.email, form.password);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    onLogin(result.user);
  }

  return (
    <div className="fleet-shell">
      <input className="menu-toggle" type="checkbox" id="menu-toggle" aria-label="Ouvrir le menu" />
      <label className="hamburger" htmlFor="menu-toggle" aria-hidden="true">
        <span />
        <span />
        <span />
      </label>

      <AuthSidebar onConnect={onConnect} onRegister={onRegister} onAdmin={onAdmin} />

      <main className="main-panel">
        <section className="auth-area" id="connexion">
          <h1>FleetManager</h1>

          <form className="login-card" onSubmit={handleSubmit}>
            <h2>CONNEXION</h2>

            <div className="field-stack">
              <input
                type="text"
                placeholder="Email, ou Téléphone"
                aria-label="Email ou téléphone"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                aria-label="Mot de passe"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" />
                <span>Souviens-toi de moi</span>
              </label>
              <button type="button" className="forgot-link" onClick={() => setShowReset(!showReset)}>
                Mot de pass oublié ?
              </button>
            </div>

            {showReset && (
              <div className="reset-box">
                <p>Entre ton email pour recevoir un lien de récupération.</p>
                <div className="reset-actions">
                  <input type="email" placeholder="Votre email" aria-label="Email de récupération" />
                  <button type="button">Envoyer</button>
                </div>
              </div>
            )}

            <button type="submit" className="primary-button">
              SE CONNECTER
            </button>

            {message && <p className="form-message">{message}</p>}

            <p className="signup-text">
              Pas encore de compte? <button type="button" onClick={onRegister}>Créer un nouveau compte</button>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
