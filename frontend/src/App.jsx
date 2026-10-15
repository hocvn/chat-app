import { useEffect } from 'react'

import NavBar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'

import { Navigate, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div data-theme={theme} className="flex justify-center items-center h-screen bg-base-100"> 
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;
