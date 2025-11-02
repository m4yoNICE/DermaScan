import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from './adminLoginPage.jsx';

function App() {
  return (
    <>
  <Routes>
    <Route path="/" element={<AdminLoginPage />} />
  </Routes>
    </>
  )
}

export default App
