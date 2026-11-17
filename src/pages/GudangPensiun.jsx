import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArchiveRestore, AlertOctagon, ArrowLeft } from 'lucide-react'

export default function GudangPensiun() {
  const navigate = useNavigate()
  const [memes, setMemes] = useState([])

  useEffect(() => {
    const savedMemes = JSON.parse(localStorage.getItem('memeData')) || []
    setMemes(savedMemes)
  }, [])

  const handleRestore = (id) => {
    if (window.confirm('Keluarkan mahakarya ini dari masa pensiun dan kembalikan ke Katalog?')) {
      const updatedMemes = memes.map(meme => meme.id === id ? { ...meme, isDeleted: false } : meme)
      localStorage.setItem('memeData', JSON.stringify(updatedMemes))
      setMemes(updatedMemes)
    }
  }

  const handlePermanentDelete = (id) => {
    if (window.confirm('PERINGATAN: Karya ini akan dimusnahkan secara permanen dari muka bumi. Lanjut?')) {
      const filtered = memes.filter(meme => meme.id !== id)
      localStorage.setItem('memeData', JSON.stringify(filtered))
      setMemes(filtered)
    }
  }

  const formatRupiah = (angka) => {
    if (typeof angka === 'string' && angka.includes('Rp')) return angka;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);
  }

  const deletedMemes = memes.filter(meme => meme.isDeleted)

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-4 md:p-8 font-serif text-gray-800">
      <div className="max-w-6xl mx-auto bg-[#faf8f5] border border-gray-300 p-6 md:p-12 shadow-sm">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-red-700 text-xs uppercase tracking-widest mb-6 transition w-fit">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="text-center mb-12 border-b border-gray-200 pb-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-4 mt-6 text-red-900">
            GUDANG PENSIUN
          </h1>
          <p className="text-xs md:text-sm text-gray-500 tracking-[0.3em] uppercase">
            Tempat Peristirahatan Terakhir Karya-Karya Estetik
          </p>
        </div>

        {deletedMemes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border border-dashed border-gray-300">
            <p className="tracking-widest uppercase text-sm">Gudang pensiun masih suci dan bersih.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deletedMemes.map((meme) => (
              <div key={meme.id} className="group flex flex-col bg-white border border-red-100 hover:border-red-300 opacity-80 transition-all duration-300 hover:shadow-xl">
                
                <div className="h-56 bg-red-50 p-4 flex items-center justify-center overflow-hidden border-b border-red-100 relative">
                  <div className="absolute top-3 left-3 backdrop-blur text-[8px] px-2 py-1 tracking-widest border z-10 bg-red-100 text-red-600 border-red-200">
                    MASA PENSIUN
                  </div>
                  {meme.url ? (
                    <img src={meme.url} alt={meme.judul} className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" />
                  ) : (
                    <span className="text-gray-300 text-xs italic">Karya Abstrak</span>
                  )}
                </div>
                
                <div className="p-5 text-center flex flex-col flex-grow">
                  <p className="text-[9px] text-gray-400 tracking-[0.2em] mb-1 uppercase">Aktor: {meme.karakter}</p>
                  <h2 className="text-sm font-semibold tracking-wider uppercase mb-2 flex-grow text-gray-500 line-through">{meme.judul}</h2>
                  <p className="font-medium tracking-widest text-xs mb-4 text-gray-400">
                    {formatRupiah(meme.harga)}
                  </p>
                  
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <button onClick={() => handleRestore(meme.id)} className="text-[10px] flex items-center gap-1 text-green-600 hover:text-green-800 uppercase tracking-widest transition">
                      <ArchiveRestore size={12}/> Bangkitkan
                    </button>
                    <button onClick={() => handlePermanentDelete(meme.id)} className="text-[10px] flex items-center gap-1 text-red-600 hover:text-red-800 uppercase tracking-widest transition font-bold">
                      <AlertOctagon size={12}/> Musnahkan
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
