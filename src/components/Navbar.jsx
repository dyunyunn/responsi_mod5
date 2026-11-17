import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const path = location.pathname

  // Fungsi pintar buat nentuin gaya menu (Aktif vs Pasif)
  const getLinkStyle = (targetPath) => {
    // Kalau path sekarang cocok sama targetPath (atau lagi di halaman edit dan targetnya /tambah)
    const isActive = path === targetPath || (targetPath === '/tambah' && path.startsWith('/edit'))
    
    if (isActive) {
      return "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1 transition-all"
    } else {
      return "text-white hover:text-gray-200 hover:border-b-2 hover:border-gray-300 border-b-2 border-transparent pb-1 transition-all"
    }
  }

  return (
    <nav className="bg-[#4a5d23] p-5 shadow-md flex flex-wrap justify-center gap-6 md:gap-10 font-sans text-[11px] md:text-sm uppercase tracking-[0.15em]">
      <Link to="/" className={getLinkStyle('/')}>Katalog</Link>
      <Link to="/tambah" className={getLinkStyle('/tambah')}>Tambah Meme</Link>
      <Link to="/gudang" className={getLinkStyle('/gudang')}>Gudang Pensiun</Link>
      <Link to="/profil" className={getLinkStyle('/profil')}>Profil Author</Link>
    </nav>
  )
}