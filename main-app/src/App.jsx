import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import Header from "./components/Header";
import RemoteLibrary from "./components/RemoteLibrary";

function Shell() {
  const { session } = useAuth();

  if (!session) return <LoginPage />;

  return (
    <div className="min-h-screen">
      <Header />
      <RemoteLibrary role={session.role} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
