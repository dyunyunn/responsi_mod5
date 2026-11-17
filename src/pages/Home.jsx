import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import { supabase } from '../supabase'

export default function Home() {
  const [memes, setMemes] = useState([])
  const [activeFilter, setActiveFilter] = useState('semua')
  const [sortOrder, setSortOrder] = useState('terbaru')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemes()
  }, [])

  const fetchMemes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error("Error fetching:", error)
    else setMemes(data || [])
    setLoading(false)
  }

  const handleSoftDelete = async (id) => {
    if (window.confirm('Mohon maaf, apakah Anda yakin ingin memensiunkan mahakarya ini ke gudang?')) {
      const { error } = await supabase
        .from('memes')
        .update({ isDeleted: true })
        .eq('id', id)
      
      if (!error) fetchMemes() // Refresh data
    }
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);
  }

  let processedMemes = memes.filter(meme => {
    if (meme.isDeleted) return false 
    if (activeFilter !== 'semua' && meme.kategori !== activeFilter) return false
    return true 
  })

  processedMemes.sort((a, b) => {
    if (sortOrder === 'termahal') return b.harga - a.harga
    if (sortOrder === 'termurah') return a.harga - b.harga
    return 0 // 'terbaru' sudah di-handle oleh order('created_at') dari Supabase
  })

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-4 md:p-8 font-serif text-gray-800">
      <div className="max-w-6xl mx-auto bg-[#faf8f5] border border-gray-300 p-6 md:p-12 shadow-sm">
        
        <div className="text-center mb-10 border-b border-gray-200 pb-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-4 text-[#2c3519]">
            GALERI KELUH KESAH
          </h1>
          <p className="text-xs md:text-sm text-gray-500 tracking-[0.3em] uppercase">
            Koleksi Terbatas Untuk Jiwa-Jiwa Yang Lelah
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase mb-10 text-gray-400">
          <div className="flex gap-6 mb-6 md:mb-0 flex-wrap justify-center">
            {['semua', 'Kenyataan Pahit', 'Sentilan Kalbu', 'Di Luar Nalar'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)} 
                className={`pb-1 transition ${activeFilter === filter ? 'text-[#4a5d23] font-bold border-b border-[#4a5d23]' : 'hover:text-gray-800'}`}>
                {filter === 'semua' ? 'Seluruh Mahakarya' : filter}
              </button>
            ))}
          </div>
          
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border border-gray-300 px-3 py-2 cursor-pointer bg-transparent focus:outline-none hover:bg-gray-50 text-gray-600 font-bold">
            <option value="terbaru">TERBARU ESTETIK</option>
            <option value="termahal">PALING MAHAL</option>
            <option value="termurah">PALING BERSAHAJA</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 uppercase tracking-widest text-sm">Mengambil karya dari awan...</div>
        ) : processedMemes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border border-dashed border-gray-300">
            <p className="tracking-widest uppercase text-sm">Galeri kosong melompong.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedMemes.map((meme) => (
              <div key={meme.id} className="group flex flex-col bg-white border border-gray-200 hover:border-[#4a5d23] transition-all duration-300 hover:shadow-xl">
                <Link to={`/detail/${meme.id}`} className="h-56 bg-[#fdfdfd] p-4 flex items-center justify-center overflow-hidden border-b border-gray-100 relative cursor-pointer block">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[8px] px-2 py-1 tracking-widest border border-gray-200 z-10 text-gray-500">
                    {meme.kategori ? meme.kategori.toUpperCase() : 'MAHAL & BERSAHAJA'}
                  </div>
                  {meme.url ? (
                    <img src={meme.url} alt={meme.judul} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <span className="text-gray-300 text-xs italic">Karya Abstrak</span>
                  )}
                </Link>
                <div className="p-5 text-center flex flex-col flex-grow">
                  <p className="text-[9px] text-gray-400 tracking-[0.2em] mb-1 uppercase">Aktor: {meme.karakter}</p>
                  <Link to={`/detail/${meme.id}`} className="text-sm font-semibold tracking-wider uppercase mb-2 text-gray-800 flex-grow hover:text-[#4a5d23] transition">{meme.judul}</Link>
                  <p className="font-medium text-[#4a5d23] tracking-widest text-xs mb-4">{formatRupiah(meme.harga)}</p>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <Link to={`/edit/${meme.id}`} className="text-[10px] flex items-center gap-1 text-gray-500 hover:text-yellow-600 uppercase tracking-widest transition"><Edit size={12}/> Revisi</Link>
                    <button onClick={() => handleSoftDelete(meme.id)} className="text-[10px] flex items-center gap-1 text-red-400 hover:text-red-600 uppercase tracking-widest transition"><Trash2 size={12}/> Pensiunkan</button>
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
