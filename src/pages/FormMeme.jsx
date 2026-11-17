import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FormMeme() {
  const navigate = useNavigate()
  const { id } = useParams() 
  
  const [formData, setFormData] = useState({
    judul: '',
    karakter: '',
    kategori: 'Kenyataan Pahit', // Default baru
    url: '',
    harga: ''
  })

  useEffect(() => {
    if (id) {
      const savedMemes = JSON.parse(localStorage.getItem('memeData')) || []
      const memeToEdit = savedMemes.find(m => m.id === parseInt(id))
      if (memeToEdit) {
        setFormData({
          ...memeToEdit,
          kategori: memeToEdit.kategori || 'Kenyataan Pahit' // Fallback baru
        })
      }
    }
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB ya biar nggak error!')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, url: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const savedMemes = JSON.parse(localStorage.getItem('memeData')) || []
    
    if (id) {
      const updatedMemes = savedMemes.map(m => m.id === parseInt(id) ? { ...formData, id: parseInt(id) } : m)
      localStorage.setItem('memeData', JSON.stringify(updatedMemes))
    } else {
      const newMeme = { ...formData, id: Date.now() }
      localStorage.setItem('memeData', JSON.stringify([...savedMemes, newMeme]))
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] p-8 flex justify-center items-center font-sans">
      <div className="max-w-4xl w-full flex flex-col">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#4a5d23] text-xs uppercase tracking-widest mb-4 transition w-fit">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="w-full bg-white shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center border border-gray-100 p-4 rounded-xl min-h-[300px]">
            {formData.url ? (
              <img src={formData.url} alt="Preview" className="object-contain h-full w-full rounded" />
            ) : (
              <span className="text-gray-400 italic text-sm text-center">Preview Gambar<br/>(Pilih file dari perangkatmu)</span>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-light mb-2">{id ? 'Revisi Mahakarya' : 'Tambah Mahakarya'}</h2>
            <p className="text-sm text-gray-500 mb-6">Kurasi meme terbaikmu ke dalam katalog eksklusif ini.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Judul Meme</label>
                <input type="text" name="judul" value={formData.judul} onChange={handleChange} required
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent" placeholder="Cth: Cuti Dulu Ya" />
              </div>
              
              {/* DROPDOWN KATEGORI ESTETIK */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Kategori Genre</label>
                <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent text-gray-700 cursor-pointer">
                  <option value="Kenyataan Pahit">Kenyataan Pahit (Relatable)</option>
                  <option value="Sentilan Kalbu">Sentilan Kalbu (Sindiran)</option>
                  <option value="Di Luar Nalar">Di Luar Nalar (Absurd)</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Aktor / Karakter</label>
                <input type="text" name="karakter" value={formData.karakter} onChange={handleChange} required
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent" placeholder="Cth: Patrick Star" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Nilai Estetika (Hanya Angka)</label>
                <input type="number" name="harga" value={formData.harga} onChange={handleChange} required min="0"
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent" placeholder="Cth: 99000" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Unggah Karya (Max 2MB)</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} required={!id && !formData.url}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#4a5d23] file:text-white hover:file:bg-[#3b4a1c]" />
              </div>
              
              <button type="submit" className="mt-4 bg-[#4a5d23] text-white py-3 uppercase tracking-widest text-sm hover:bg-[#3b4a1c] transition rounded-full">
                {id ? 'Simpan Revisi' : 'Pajang di Galeri'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}