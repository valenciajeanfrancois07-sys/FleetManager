const USERS_KEY = 'fleetmanager_users';
const SESSION_KEY = 'fleetmanager_session';
const VEHICLES_KEY = 'fleetmanager_vehicles';
const TRASH_KEY = 'fleetmanager_trash';
const MATERIALS_KEY = 'fleetmanager_materials';
const MATERIALS_TRASH_KEY = 'fleetmanager_materials_trash';
const HISTORY_KEY = 'fleetmanager_history';
const HISTORY_TRASH_KEY = 'fleetmanager_history_trash';

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

export function getUsers() {
  return read(USERS_KEY, []);
}

export function saveUsers(users) {
  write(USERS_KEY, users);
}

export function createUser(user) {
  const users = getUsers();
  const email = user.email.trim().toLowerCase();
  const exists = users.some((currentUser) => currentUser.email === email);

  if (exists) {
    return { ok: false, message: 'Cet email existe déjà.' };
  }

  const newUser = {
    id: Date.now(),
    nom: user.nom.trim(),
    email,
    password: user.password,
    role: 'Employée',
  };

  write(USERS_KEY, [...users, newUser]);
  setSession(newUser);

  return { ok: true, user: newUser };
}

export function loginUser(emailOrPhone, password) {
  const value = emailOrPhone.trim().toLowerCase();
  const user = getUsers().find(
    (currentUser) => currentUser.email === value && currentUser.password === password,
  );

  if (!user) {
    return { ok: false, message: 'Email ou mot de passe incorrect.' };
  }

  setSession(user);
  return { ok: true, user };
}

export function setSession(user) {
  write(SESSION_KEY, {
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  });
}

export function getSession() {
  return read(SESSION_KEY, null);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getVehicles() {
  const vehicles = read(VEHICLES_KEY, []);
  const hasOldDemoVehicles =
    vehicles.length === 3 &&
    vehicles.every((vehicle) => vehicle.nom === 'Véhicule 1') &&
    vehicles.some((vehicle) => vehicle.etat === 'Bon') &&
    vehicles.some((vehicle) => vehicle.etat === 'En panne') &&
    vehicles.some((vehicle) => vehicle.etat === 'Entretien');

  if (hasOldDemoVehicles) {
    saveVehicles([]);
    return [];
  }

  return vehicles;
}

export function saveVehicles(vehicles) {
  write(VEHICLES_KEY, vehicles);
}

export function getTrashVehicles() {
  return read(TRASH_KEY, []);
}

export function saveTrashVehicles(vehicles) {
  write(TRASH_KEY, vehicles);
}

export function deleteVehicle(vehicleId) {
  const vehicles = getVehicles().filter((vehicle) => vehicle.id !== vehicleId);
  saveVehicles(vehicles);
  return vehicles;
}

export function deleteUser(userId) {
  const users = getUsers().filter((user) => user.id !== userId);
  saveUsers(users);
  return users;
}

export function getMaterials() {
  return read(MATERIALS_KEY, []);
}

export function saveMaterials(materials) {
  write(MATERIALS_KEY, materials);
}

export function getTrashMaterials() {
  return read(MATERIALS_TRASH_KEY, []);
}

export function saveTrashMaterials(materials) {
  write(MATERIALS_TRASH_KEY, materials);
}

export function getHistory() {
  return read(HISTORY_KEY, []);
}

export function saveHistory(history) {
  write(HISTORY_KEY, history);
}

export function addHistoryEntry(entry) {
  const history = getHistory();
  const nextEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...entry,
  };

  write(HISTORY_KEY, [nextEntry, ...history]);
  return nextEntry;
}

export function getTrashHistory() {
  return read(HISTORY_TRASH_KEY, []);
}

export function saveTrashHistory(history) {
  write(HISTORY_TRASH_KEY, history);
}
