// Test du système d'authentification
const USERS_KEY = 'fleetmanager_users';
const SESSION_KEY = 'fleetmanager_session';

const DEFAULT_ADMIN_USER = {
  id: 1,
  nom: 'Administrateur',
  email: 'admin@fleetmanager.local',
  password: 'admin123',
  role: 'Admin',
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = read(USERS_KEY, []);
  if (users.length === 0) {
    const initialUsers = [DEFAULT_ADMIN_USER];
    write(USERS_KEY, initialUsers);
    return initialUsers;
  }
  return users;
}

function loginUser(emailOrPhone, password) {
  const value = emailOrPhone.trim().toLowerCase();
  const users = getUsers();
  
  console.log('Tentative de connexion avec:', { emailOrPhone, password });
  console.log('Utilisateurs disponibles:', users);
  
  const user = users.find(
    (currentUser) => currentUser.email === value && currentUser.password === password,
  );

  if (!user) {
    console.log('Utilisateur non trouvé ou mot de passe incorrect');
    return { ok: false, message: 'Email ou mot de passe incorrect.' };
  }

  console.log('Connexion réussie:', user);
  return { ok: true, user };
}

// Test
console.log('=== TEST D\'AUTHENTIFICATION ===');
console.log('Utilisateurs initialisés:', getUsers());
console.log('\nTentative avec admin:');
const result = loginUser('admin@fleetmanager.local', 'admin123');
console.log('Résultat:', result);
