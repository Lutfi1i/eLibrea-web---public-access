import { authOptions } from '../../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import Signoutbutton from '@/components/SignoutButton'
import UploadProfile from '@/components/Uploadimage'
import BookCard from '@/components/BookCard'
import Image from 'next/image'

export default async function Page() {
  const sessionLogin = await getServerSession(authOptions)
  const user = sessionLogin?.user
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start gap-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="relative w-40 h-56 rounded-lg overflow-hidden">
                {user?.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    width={160}
                    height={224}
                    className="h-40 w-60 object-cover rounded-full"
                    alt="Profile picture"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-2">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {user?.name || 'Guest User'}
              </h1>
              <p className="text-gray-600 mb-4">{user?.email || 'No email provided'}</p>
              <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p><span className="font-medium">Member since:</span> 2025</p>
                <p><span className="font-medium">Username:</span> {user?.name}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <UploadProfile />
                <Signoutbutton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dipinjam</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Buku Dipinjam</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h2 className="font-semibold text-gray-900 mb-3">Deskripsi:</h2>
          <p className="text-gray-700 leading-relaxed">
            Selamat datang di profil perpustakaan digital Anda. Di sini Anda dapat mengelola koleksi buku, 
            melihat riwayat peminjaman, dan mengatur preferensi akun Anda.
          </p>
        </div>
      </div>

      {/* Books Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Buku lainnya</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* BookCard components would go here */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-3/4 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-xs">SAMPUL</p>
                    <p className="text-xs">BUKU</p>
                  </div>
                </div>
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                  Matematika Terapan
                </h3>
                <p className="text-xs text-gray-600">Pelajaran</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}