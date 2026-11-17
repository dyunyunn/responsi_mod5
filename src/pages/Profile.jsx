import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ArrowLeft } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const [profilePic, setProfilePic] = useState('https://i.pinimg.com/736x/8d/3a/05/8d3a055ab2b4e8c56cc6b7a3ccfe42c4.jpg')

  useEffect(() => {
    const savedPic = localStorage.getItem('profilePic')
    if (savedPic) {
      setProfilePic(savedPic)
    }
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB ya biar nggak error!')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setProfilePic(base64String) 
        localStorage.setItem('profilePic', base64String) 
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] p-8 flex justify-center items-center font-serif flex-col">
      
      <div className="max-w-md w-full mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#4a5d23] text-xs uppercase tracking-widest transition w-fit">
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <div className="max-w-md w-full bg-[#fdfbf9] border border-gray-300 p-10 text-center shadow-sm">
        
        <div className="relative w-24 h-24 mx-auto mb-6 group">
          <div className="w-full h-full bg-gray-200 rounded-full border-4 border-white shadow flex items-center justify-center overflow-hidden">
            <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
          </div>
          
          <label className="absolute bottom-0 right-0 bg-[#4a5d23] text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-[#3b4a1c] transition-colors flex items-center justify-center border-2 border-white">
            <Camera size={14} />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        
        <h1 className="text-2xl font-light tracking-wide mb-1 uppercase">Yunita Dwi Ardilasari</h1>
        <p className="text-yellow-700 text-sm tracking-widest mb-6">Kurator Meme Ahli Nih Boss</p>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 uppercase tracking-wider">NIM</span>
            <span className="font-semibold text-gray-800">21120124120001</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 uppercase tracking-wider">Kelompok</span>
            <span className="font-semibold text-gray-800">kosong satu kak</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 italic">"Membangun PWA satu meme pada satu waktu."</p>
      </div>
    </div>
  )
}
