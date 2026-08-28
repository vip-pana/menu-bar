import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Guest from './pages/Guest'
import Barista from './pages/Barista'
import ConfigError from './ConfigError'
import { missingConfig } from './firebase'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {missingConfig.length ? (
      <ConfigError />
    ) : (
      <HashRouter>
        <Routes>
          <Route path="/" element={<Guest />} />
          <Route path="/barista" element={<Barista />} />
        </Routes>
      </HashRouter>
    )}
  </React.StrictMode>,
)
