import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Habits from "./pages/Habits";
import CalendarPage from "./pages/Calendar";
import CharacterPage from "./pages/Character";
import Goals from "./pages/Goals";
import Focus from "./pages/Focus";
import Notes from "./pages/Notes";
import Stats from "./pages/Stats";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Загрузка…
      </div>
    );

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />
      <Route path="/forgot" element={<ForgotPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/character" element={<CharacterPage />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/welcome"} replace />}
      />
    </Routes>
  );
}
