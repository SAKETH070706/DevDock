import {Routes,Route,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App(){
    return(
        <Routes>
  <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<Login />} />

   <Route path="/forgot-password" element={<ForgotPassword />} />

   <Route path="/reset-password" element={<ResetPassword />} />

  <Route path="/register" element={<Register />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
        path="/create-room"
        element={
          <ProtectedRoute>
            <CreateRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join-room"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />
      <Route
    path="/room/:roomId"
    element={
        <ProtectedRoute>
            <Room />
        </ProtectedRoute>
    }
/>
</Routes>

    );
}

export default App;