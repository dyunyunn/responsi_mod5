import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { supabase } from '../supabase'

export default function DetailMeme() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meme, setMeme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemeDetail()
  }, [id])

  const fetchMemeDetail = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error("Error fetching detail:", error)
    } else {
      setMeme(data)
    }
    setLoading(false)
  }

  const handleSoftDelete = async () => {
    if (window.confirm('Mohon maaf, apakah Anda yakin ingin memensiunkan mahakarya ini ke gudang?')) {
      const { error } = await supabase
        .from('memes')
        .update({ isDeleted: true })
        .eq('id', id)
      
      if (!error) {
        navigate('/') 
      } else {
        alert('Gagal memensiunkan karya.')
      }
    }
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0)
  }

  // Fungsi untuk membedakan teks deskripsi berdasarkan kategori
  const renderDeskripsi = (kategori) => {
    if (kategori === 'Sentilan Kalbu') {
      return (
        <>
          Karya bergenre <span className="font-bold text-gray-700 not-italic">Sentilan Kalbu</span> ini hadir sebagai tamparan halus untuk jiwa-jiwa yang sering lupa diri. Sebuah mahakarya sarkasme tingkat tinggi yang siap menyindir tajam tanpa perlu merangkai banyak kata.
        </>
      )
    } else if (kategori === 'Di Luar Nalar') {
      return (
        <>
          Mahakarya absurd bergenre <span className="font-bold text-gray-700 not-italic">Di Luar Nalar</span> ini sukses menembus batas logika manusia normal. Sangat cocok untuk ditertawakan di tengah malam ketika otak sudah menolak untuk memperbaiki error kodingan.
        </>
      )
    } else {
      return (
        <>
          Karya estetika bergenre <span className="font-bold text-gray-700 not-italic">{kategori || 'Kenyataan Pahit'}</span> ini adalah manifestasi dari keluh kesah yang tertunda. Sangat cocok untuk menggambarkan perasaan hampa di hari Senin pagi atau saat melihat deadline tugas responsi.
        </>
      )
    }
  }

  if (loading) return <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center font-serif text-gray-500 uppercase tracking-widest text-sm">Menyiapkan pameran...</div>
  
  if (!meme) return <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center font-serif text-gray-500 uppercase tracking-widest text-sm">Karya tidak ditemukan.</div>

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-4 md:p-8 flex justify-center items-center font-serif">
      <div className="max-w-5xl w-full bg-[#faf8f5] border border-gray-300 p-6 md:p-12 shadow-sm flex flex-col">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#4a5d23] text-xs uppercase tracking-widest mb-8 transition w-fit">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
          
          <div className="w-full md:w-1/2">
            <div className="bg-white p-4 border border-gray-200 shadow-md relative group">
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[10px] px-3 py-1 tracking-widest border border-gray-200 z-10 text-gray-600 uppercase">
                {meme.kategori || 'Kenyataan Pahit'}
              </div>
              <div className="bg-[#fdfdfd] border border-gray-100 p-2 overflow-hidden h-[400px] flex items-center justify-center">
                {meme.url ? (
                  <img src={meme.url} alt={meme.judul} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-gray-300 text-sm italic">Karya Abstrak</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center pt-4 md:pt-10">
            <p className="text-[10px] text-gray-400 tracking-[0.3em] mb-2 uppercase">Pameran Utama: {meme.karakter}</p>
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 leading-tight uppercase">{meme.judul}</h1>
            
            {/* Memanggil fungsi deskripsi dinamis */}
            <p className="text-gray-500 text-sm mb-8 leading-relaxed border-l-2 border-[#4a5d23] pl-4 italic">
              {renderDeskripsi(meme.kategori)}
            </p>

            <p className="text-2xl text-[#4a5d23] font-medium tracking-wider mb-10">{formatRupiah(meme.harga)}</p>

            <div className="flex gap-4 border-t border-gray-200 pt-6">
              <Link to={`/edit/${meme.id}`} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-3 uppercase tracking-widest text-xs hover:bg-gray-50 hover:text-yellow-600 transition">
                <Edit size={14} /> Revisi
              </Link>
              <button onClick={handleSoftDelete} className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-400 py-3 uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-600 transition">
                <Trash2 size={14} /> Pensiunkan
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
