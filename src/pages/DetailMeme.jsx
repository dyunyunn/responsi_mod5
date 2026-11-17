import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export default function DetailMeme() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meme, setMeme] = useState(null)

  useEffect(() => {
    const savedMemes = JSON.parse(localStorage.getItem('memeData')) || []
    const foundMeme = savedMemes.find(m => m.id === parseInt(id))
    setMeme(foundMeme)
  }, [id])

  const handleSoftDelete = () => {
    if (window.confirm('Pensiunkan karya ini ke gudang?')) {
      const savedMemes = JSON.parse(localStorage.getItem('memeData')) || []
      const updatedMemes = savedMemes.map(m => m.id === parseInt(id) ? { ...m, isDeleted: true } : m)
      localStorage.setItem('memeData', JSON.stringify(updatedMemes))
      navigate('/')
    }
  }

  const formatRupiah = (angka) => {
    if (typeof angka === 'string' && angka.includes('Rp')) return angka;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);
  }

  if (!meme) return <div className="min-h-screen flex items-center justify-center font-serif text-gray-500">Mencari mahakarya...</div>

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-4 md:p-8 font-serif text-gray-800">
      <div className="max-w-5xl mx-auto bg-[#faf8f5] border border-gray-300 p-6 md:p-12 shadow-sm relative">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#4a5d23] text-xs uppercase tracking-widest mb-8 transition">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 bg-white border border-gray-200 p-4 flex items-center justify-center relative min-h-[400px]">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[9px] px-3 py-1 tracking-widest border border-gray-200 z-10 text-gray-500">
              {meme.kategori ? meme.kategori.toUpperCase() : 'MAHAL & BERSAHAJA'}
            </div>
            {meme.url ? (
              <img src={meme.url} alt={meme.judul} className="object-contain w-full h-full max-h-[500px]" />
            ) : (
              <span className="text-gray-300 italic">Karya Abstrak</span>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h4 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">Pemeran Utama: {meme.karakter}</h4>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide uppercase mb-4 text-[#2c3519]">{meme.judul}</h1>
            
            <div className="w-12 h-[1px] bg-[#4a5d23] mb-6"></div>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Karya estetika bergenre <span className="font-bold text-gray-700">{meme.kategori || 'Kenyataan Pahit'}</span> ini adalah manifestasi dari keluh kesah yang tertunda. 
              Sangat cocok untuk menggambarkan perasaan di hari Senin pagi atau saat melihat <i>deadline</i> tugas responsi.
            </p>

            <p className="font-medium text-[#4a5d23] tracking-widest text-xl mb-10">
              {formatRupiah(meme.harga)}
            </p>

            <div className="flex gap-4 border-t border-gray-200 pt-6">
              <Link to={`/edit/${meme.id}`} className="flex-1 border border-gray-300 text-center py-3 text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#4a5d23] transition flex justify-center items-center gap-2">
                <Edit size={14} /> Revisi
              </Link>
              <button onClick={handleSoftDelete} className="flex-1 border border-red-200 text-center py-3 text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-700 transition flex justify-center items-center gap-2">
                <Trash2 size={14} /> Pensiunkan
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
