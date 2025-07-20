import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import PapersPage from "./pages/PapersPage"
import PaperDetailPage from "./pages/PaperDetailPage"
import UploadPage from "./pages/UploadPage"
import ProfilePage from "./pages/ProfilePage"
import MyPapersPage from "./pages/MyPapersPage"
// Components
import Navbar from "./components/common/Navbar"
import Footer from "./components/common/Footer"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/papers" element={<PapersPage />} />
              <Route path="/papers/:id" element={<PaperDetailPage />} />
              <Route path="/papers/user/papers" element={<MyPapersPage />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
