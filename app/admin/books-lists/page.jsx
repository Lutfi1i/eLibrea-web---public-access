"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import defaultNullImage from "@/public/Book-Untitled-cover.png";
import { getImageUrl, getApiUrl } from "@/lib/api";

export default function BooksListPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const deleteBook = async (id) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    const res = await fetch(getApiUrl(`/api/buku/${id}`), {
      method: "DELETE",
    });

    if (res.ok) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  const archiveBook = async (id) => {
    if (!confirm("Yakin ingin meng-archive buku ini?")) return;

    const res = await fetch(getApiUrl(`/api/buku/${id}/archive`), {
      method: "PATCH",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Update the book's archived status in the list
        setBooks(books.map((b) => (b.id === id ? { ...b, archived: true } : b)));
      }
    }
  };

  const unarchiveBook = async (id) => {
    if (!confirm("Yakin ingin meng-unarchive buku ini?")) return;

    const res = await fetch(getApiUrl(`/api/buku/${id}/unarchive`), {
      method: "PATCH",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Update the book's archived status in the list
        setBooks(books.map((b) => (b.id === id ? { ...b, archived: false } : b)));
      }
    }
  };

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch(getApiUrl("/api/buku/all"));
        const data = await res.json();
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error("Expected array but got:", data);
          setBooks([]);
        }
      } catch (error) {
        console.error("Error loading books:", error);
        setBooks([]);
      }
    };

    loadBooks();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = Array.isArray(books) ? books.slice(indexOfFirst, indexOfLast) : [];
  const totalPages = Array.isArray(books) ? Math.ceil(books.length / itemsPerPage) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books List</h1>
        <Link
          href="/admin/books-create"
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          + Tambah Buku
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4">Cover</th>
              <th className="p-4">Judul</th>
              <th className="p-4">Penulis</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
              <th className="p-4 w-48 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {book.cover_picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(book.cover_picture)}
                        width={50}
                        height={70}
                        className="object-cover"
                        alt="cover"
                        onError={(e) => {
                          e.target.src = defaultNullImage.src;
                        }}
                      />
                    ) : (
                      <Image
                        src={defaultNullImage}
                        width={50}
                        height={70}
                        className="object-cover"
                        alt="No cover"
                      />
                    )}
                  </td>

                  <td className="p-4">{book.judul}</td>
                  <td className="p-4">{book.penulis}</td>
                  <td className="p-4">{book.kategori}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        book.archived
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {book.archived ? "Archived" : "Active"}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2 justify-center">
                    <Link
                      href={`/admin/books-edit/${book.id}`}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>

                    {book.archived ? (
                      <button
                        onClick={() => unarchiveBook(book.id)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Unarchive
                      </button>
                    ) : (
                      <button
                        onClick={() => archiveBook(book.id)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Archive
                      </button>
                    )}

                    <button
                      onClick={() => deleteBook(book.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  Tidak ada buku ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md border 
              ${currentPage === i + 1 ? "bg-red-500 text-white" : "bg-white"}
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
