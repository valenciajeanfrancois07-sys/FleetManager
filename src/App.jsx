import { useState } from "react";
import Connect from "./pages/Connect";
import Enregist from "./pages/Enregist";
import Dashboard from "./pages/Dashboard";
import Vehicules from "./pages/Vehicules";
import Materiels from "./pages/Materiels";
import Historiques from "./pages/Historiques";
import Admin from "./pages/Admin";
import { getSession, logoutUser } from "./database";
import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getSession());
  const [page, setPage] = useState("connect");

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
    setPage("connect");
  }

  if (page === "enregist") {
    return (
      <Enregist
        onConnect={() => setPage("connect")}
        onAdmin={() => setPage("admin")}
        onRegisterSuccess={(user) => {
          setCurrentUser(user);
          setPage("dashboard");
        }}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <Dashboard
        user={currentUser}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "vehicules") {
    console.log("PAGE VEHICULES - Affichage de la page Véhicules");
    return (
      <Vehicules
        user={currentUser}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "materiels") {
    return (
      <Materiels
        user={currentUser}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "historiques") {
    return (
      <Historiques
        user={currentUser}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "admin") {
    if (!currentUser) {
      return (
        <Connect
          onConnect={() => setPage("connect")}
          onRegister={() => setPage("enregist")}
          onLogin={(user) => {
            setCurrentUser(user);
            setPage("dashboard");
          }}
        />
      );
    }

    if (currentUser.role !== "Admin") {
      // Redirect to dashboard if not admin
      setPage("dashboard");
      return null;
    }

    return (
      <Admin
        user={currentUser}
        onNavigate={setPage}
        onConnect={() => setPage("connect")}
        onRegister={() => setPage("enregist")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Connect
      currentUser={currentUser}
      onConnect={() => setPage("connect")}
      onRegister={() => setPage("enregist")}
      onAdmin={() => setPage("admin")}
      onLogin={(user) => {
        setCurrentUser(user);
        setPage("dashboard");
      }}
    />
  );
}
