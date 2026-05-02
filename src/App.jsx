import { useState } from 'react';
import Connect from './pages/Connect';
import Enregist from './pages/Enregist';
import Dashboard from './pages/Dashboard';
import Vehicules from './pages/Vehicules';
import Materiels from './pages/Materiels';
import Historiques from './pages/Historiques';
import Admin from './pages/Admin';
import { getSession, logoutUser } from './database';
import './App.css';

export default function App(){
 const [currentUser, setCurrentUser] = useState(() => getSession());
 const [page, setPage] = useState(() => (getSession() ? 'dashboard' : 'connect'));
 const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);


 if (!currentUser && getSession()) {
  setCurrentUser(getSession());
 }

 function handleLogout() {
  logoutUser();
  setCurrentUser(null);
  setIsAdminUnlocked(false);
  
  localStorage.removeItem('fleetmanager_admin_session');
  setPage('connect');
 }

 
 const getAdminUser = () => {
  if (isAdminUnlocked) {
    
    const adminData = localStorage.getItem('fleetmanager_admin_session');
    if (adminData) {
      const admin = JSON.parse(adminData);
      return { nom: admin.name || 'Admin', role: 'Admin' };
    }
    return { nom: 'Admin', role: 'Admin' };
  }
  return currentUser;
 };

 const effectiveUser = getAdminUser();

 if (page === 'enregist') {
  return <Enregist onConnect={() => setPage('connect')} onAdmin={() => setPage('admin')} onRegisterSuccess={(user) => {
   setCurrentUser(user);
   setPage('dashboard');
  }} />
 }

 if (page === 'dashboard') {
  return <Dashboard user={effectiveUser} onNavigate={setPage} onLogout={handleLogout} />
 }

 if (page === 'vehicules') {
  console.log('PAGE VEHICULES - Affichage de la page Véhicules');
  return <Vehicules user={effectiveUser} onNavigate={setPage} onLogout={handleLogout} />
 }

 if (page === 'materiels') {
  return <Materiels user={effectiveUser} onNavigate={setPage} onLogout={handleLogout} />
 }

 if (page === 'historiques') {
  return <Historiques user={effectiveUser} onNavigate={setPage} onLogout={handleLogout} />
 }

 if (page === 'admin') {
  console.log('App: Rendering Admin page, isAdminUnlocked:', isAdminUnlocked);
  return <Admin
   user={effectiveUser}
   onNavigate={setPage}
   onConnect={() => setPage('connect')}
   onRegister={() => setPage('enregist')}
   isUnlocked={isAdminUnlocked}
   onUnlock={() => setIsAdminUnlocked(true)}
   onLogout={handleLogout}
  />
 }

 return <Connect onConnect={() => setPage('connect')} onRegister={() => setPage('enregist')} onAdmin={() => setPage('admin')} onLogin={(user) => {
  setCurrentUser(user);
  setPage('dashboard');
 }} />
}
