import { useEffect, useState } from 'react'

import NavBar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'

import { Navigate } from 'react-router-dom'
import { useAuthStore } from './hooks/useAuthStore'
import { axiosInstance } from './lib/axios'
import { Routes, Route } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen"> 
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/setting" element={ authUser ? <SettingPage /> : <Navigate to='/login' />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;
