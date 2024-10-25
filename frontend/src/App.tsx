import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AuthenticationPage from "./pages/AuthenticationPage";
import Dashboard from "./pages/Dashboard";
import DocumentProcessing from "./pages/DocumentProcessing";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import CreateAssessment from "./pages/CreateAssessment";
import CreateSubmission from "./pages/CreateSubmission";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/register" element={<AuthenticationPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-processing/:assessmentId/:submissionId"
            element={
              <ProtectedRoute>
                <DocumentProcessing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-assessment"
            element={
              <ProtectedRoute>
                <CreateAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-submission/"
            element={
              <ProtectedRoute>
                <CreateSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={<ProtectedRoute>{<Profile />}</ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer  closeOnClick autoClose={2000}/>
    </>
  );
}

export default App;
