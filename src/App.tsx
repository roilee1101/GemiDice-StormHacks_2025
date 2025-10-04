
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbars'
import Home from './pages/Home'
import Characters from './pages/Characters'
import Campaigns from './pages/Campaigns'
import DiceRoller from './pages/Diceroller'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/dice" element={<DiceRoller />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #7c3aed'
            }
          }}
        />
      </div>
    </Router>
  )
}

export default App
