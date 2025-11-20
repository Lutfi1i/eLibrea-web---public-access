'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UploadProfile() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('/default.png');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert('Pilih file dulu!');
    if (!session) return alert('Kamu belum login.');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', session.user.id); // ambil dari next-auth

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      alert('Foto profil berhasil diupload!');
    } else {
      alert('Gagal upload foto profil.');
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <img
        src={preview}
        alt="preview"
        className="w-32 h-32 rounded-full object-cover mb-4 border"
      />
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-2 px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Mengupload...' : 'Upload'}
      </button>
    </div>
  );
}
