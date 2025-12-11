import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Signoutbutton from "@/components/SignoutButton";
import UploadProfile from "@/components/Uploadimage";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/api";

async function getBookmarks(userId) {
  if (!userId) return [];

  try {
    const res = await fetch(getApiUrl(`/api/bookmark/user/${userId}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch bookmarks:", res.status);
      return [];
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export default async function Page() {
  const sessionLogin = await getServerSession(authOptions);
  const user = sessionLogin?.user;
  const userId = user?.id;

  const bookmarks = await getBookmarks(userId);

  const isEmpty = !bookmarks || bookmarks.length === 0;
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
                {user?.name || "Guest User"}
              </h1>
              <p className="text-gray-600 mb-4">
                {user?.email || "No email provided"}
              </p>
              <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p>
                  <span className="font-medium">Member since:</span> 2025
                </p>
                <p>
                  <span className="font-medium">Username:</span> {user?.name}
                </p>
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

      <div className="bg-white">
        <div className="mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
           Bookmarkmu
          </h2>

          <div className="flex flex-col items-center justify-center">
            {isEmpty && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-xl font-semibold mt-4">
                  Belum ada bookmark
                </h2>
                <p className="text-gray-500 mt-2 max-w-md">
                  Kamu belum menandai buku apapun. Mulai tambahkan buku ke
                  bookmark untuk meminjammnya nanti.
                </p>
              </div>
            )}

            {!isEmpty && (
              <div className="grid grid-cols-8 md:grid-cols-8 xl:grid-cols-8 gap-20">
                {bookmarks.map((book) => (
                  <div key={book.id}>
                    {" "}
                    <Link href={`/books/${book.id}`}>
                      <BookCard
                        id={book.id}
                        title={book.judul}
                        cover={book.cover_picture}
                        category={book.kategori}
                        userId={userId}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
