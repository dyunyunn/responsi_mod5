import { useState, useEffect } from 'react'
import { RefreshCw, Trash2 } from 'lucide-react'
import { supabase } from '../supabase'

export default function GudangPensiun() {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeletedMemes()
  }, [])

  const fetchDeletedMemes = async () => {
    setLoading(true)
    // Cuma ambil meme yang status isDeleted-nya TRUE
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('isDeleted', true)
      .order('created_at', { ascending: false })
    
    if (error) console.error("Error fetching:", error)
    else setMemes(data || [])
    setLoading(false)
  }

  const handleRestore = async (id) => {
    if (window.confirm('Bangkitkan kembali mahakarya ini ke galeri utama?')) {
      const { error } = await supabase
        .from('memes')
        .update({ isDeleted: false })
        .eq('id', id)
      
      if (!error) fetchDeletedMemes() // Refresh data gudang
    }
  }

  const handlePermanentDelete = async (id, url) => {
    if (window.confirm('Musnahkan permanen? Tindakan ini tidak bisa dibatalkan.')) {
      // 1. Hapus gambar dari Storage Supabase biar hemat kapasitas
      if (url && url.includes('supabase.co')) {
        const urlParts = url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        await supabase.storage.from('memes-katalog').remove([fileName])
      }

      // 2. Hapus data dari Database
      const { error } = await supabase
        .from('memes')
        .delete()
        .eq('id', id)
      
      if (!error) fetchDeletedMemes()
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-4 md:p-8 font-serif text-gray-800">
      <div className="max-w-6xl mx-auto bg-[#faf8f5] border border-gray-300 p-6 md:p-12 shadow-sm">
        
        <div className="text-center mb-10 border-b border-gray-200 pb-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-4 text-gray-500">
            GUDANG PENSIUN
          </h1>
          <p className="text-xs md:text-sm text-gray-400 tracking-[0.3em] uppercase">
            Tempat Peristirahatan Terakhir Karya Estetika
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 uppercase tracking-widest text-sm">
            Membongkar brankas gudang...
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border border-dashed border-gray-300">
            <p className="tracking-widest uppercase text-sm">Gudang kosong. Belum ada karya yang dipensiunkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80">
            {memes.map((meme) => (
              <div key={meme.id} className="group flex flex-col bg-white border border-gray-200 transition-all duration-300">
                <div className="h-56 bg-gray-100 p-4 flex items-center justify-center overflow-hidden border-b border-gray-100 relative grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="absolute top-3 left-3 bg-black/70 text-white text-[8px] px-2 py-1 tracking-widest z-10">
                    DIPENSIUNKAN
                  </div>
                  {meme.url ? (
                    <img src={meme.url} alt={meme.judul} className="object-contain w-full h-full" />
                  ) : (
                    <span className="text-gray-300 text-xs italic">Karya Abstrak</span>
                  )}
                </div>
                <div className="p-5 text-center flex flex-col flex-grow">
                  <p className="text-sm font-semibold tracking-wider uppercase mb-4 text-gray-500 line-through">
                    {meme.judul}
                  </p>
                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <button onClick={() => handleRestore(meme.id)} className="text-[10px] flex items-center gap-1 text-[#4a5d23] hover:text-[#3b4a1c] uppercase tracking-widest transition">
                      <RefreshCw size={12}/> Bangkitkan
                    </button>
                    <button onClick={() => handlePermanentDelete(meme.id, meme.url)} className="text-[10px] flex items-center gap-1 text-red-400 hover:text-red-600 uppercase tracking-widest transition">
                      <Trash2 size={12}/> Musnahkan
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
