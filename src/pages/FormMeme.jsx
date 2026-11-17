import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../supabase'

export default function FormMeme() {
  const navigate = useNavigate()
  const { id } = useParams() 
  const [loading, setLoading] = useState(false)
  const [fileToUpload, setFileToUpload] = useState(null)
  
  const [formData, setFormData] = useState({
    judul: '',
    karakter: '',
    kategori: 'Kenyataan Pahit',
    url: '',
    harga: ''
  })

  useEffect(() => {
    if (id) fetchMemeToEdit()
  }, [id])

  const fetchMemeToEdit = async () => {
    const { data } = await supabase.from('memes').select('*').eq('id', id).single()
    if (data) setFormData(data)
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('Maksimal 2MB ya!')
      setFileToUpload(file) 
      
      // Bikin preview lokal
      const reader = new FileReader()
      reader.onloadend = () => setFormData({ ...formData, url: reader.result })
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let finalUrl = formData.url

    // Kalau ada gambar baru yang dipilih, upload ke Supabase Storage dulu
    if (fileToUpload) {
      const fileExt = fileToUpload.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('memes-katalog')
        .upload(fileName, fileToUpload)

      if (uploadError) {
        alert('Gagal upload gambar ke awan!')
        setLoading(false)
        return
      }

      // Ambil link public gambarnya
      const { data: publicUrlData } = supabase.storage
        .from('memes-katalog')
        .getPublicUrl(fileName)
      
      finalUrl = publicUrlData.publicUrl
    }

    const payload = {
      judul: formData.judul,
      karakter: formData.karakter,
      kategori: formData.kategori,
      harga: parseInt(formData.harga),
      url: finalUrl,
      isDeleted: false
    }

    if (id) {
      await supabase.from('memes').update(payload).eq('id', id)
    } else {
      await supabase.from('memes').insert([payload])
    }
    
    setLoading(false)
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
              <span className="text-gray-400 italic text-sm text-center">Preview Gambar</span>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-light mb-2">{id ? 'Revisi Mahakarya' : 'Tambah Mahakarya'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Judul Meme</label>
                <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent" />
              </div>
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
                <input type="text" name="karakter" value={formData.karakter} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Nilai Estetika (Hanya Angka)</label>
                <input type="number" name="harga" value={formData.harga} onChange={handleChange} required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent" />
              </div>
              
              {/* FILE INPUT YANG SUDAH DIPERBAIKI UI-NYA */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Unggah Karya</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  required={!id && !formData.url} 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-800 bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#4a5d23] file:text-white hover:file:bg-[#3b4a1c] file:cursor-pointer cursor-pointer text-sm text-gray-500" 
                />
              </div>
              
              <button type="submit" disabled={loading} className="mt-4 bg-[#4a5d23] text-white py-3 uppercase tracking-widest text-sm hover:bg-[#3b4a1c] transition rounded-full disabled:opacity-50">
                {loading ? 'Mengunggah...' : (id ? 'Simpan Revisi' : 'Pajang di Galeri')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}