import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/Documents";
import UploadDocument from "./pages/dashboard/UploadDocument";
import Profile from "./pages/dashboard/Profile";
import DocumentDetails from "./pages/dashboard/DocumentDetails";

import ProtectedRoute from "./routes/ProtectedRoute";
import AssignedDocuments from "./pages/dashboard/AssignedDocuments";
import InviteAccept from "./pages/dashboard/InviteAccept";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/upload"
            element={<UploadDocument />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
          <Route
           path="/documents/:id"
          element={<DocumentDetails />}
          />
          <Route
  path="/assigned"
  element={<AssignedDocuments />}
/>
          <Route
            path="/invite"
            element={<InviteAccept />}
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;