import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import FormMeme from './pages/FormMeme'
import Profile from './pages/Profile'
import GudangPensiun from './pages/GudangPensiun'
import DetailMeme from './pages/DetailMeme'

function App() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar /> 
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tambah" element={<FormMeme />} />
          <Route path="/edit/:id" element={<FormMeme />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/gudang" element={<GudangPensiun />} />
          <Route path="/detail/:id" element={<DetailMeme />} />
        </Routes>
      </main>
    </div>
  )
}

export default App