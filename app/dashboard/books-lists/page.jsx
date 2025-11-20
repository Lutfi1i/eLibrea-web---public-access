'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import defaultNullImage from '@/public/Book-Untitled-cover.png';

export default function BooksListPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data buku
  const getBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Hapus buku
  const deleteBook = async (id) => {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;

    const res = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

    useEffect(() => {
    const loadBooks = async () => {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    };

    loadBooks();
  }, []);


  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books List</h1>
        <Link
          href="/dashboard/books-create"
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
              <th className="p-4 w-32 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentBooks.length > 0 ? (
              currentBooks.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Image
                      src={book.cover_picture || defaultNullImage}
                      width={50}
                      height={70}
                      className="object-cover"
                      alt="cover"
                    />
                  </td>

                  <td className="p-4">{book.judul}</td>
                  <td className="p-4">{book.penulis}</td>
                  <td className="p-4">{book.kategori}</td>

                  <td className="p-4 flex gap-2 justify-center">
                    <Link
                      href={`/dashboard/books-edit/${book.id}`}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteBook(book.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="p-4 text-center text-gray-500"
                  colSpan={5}
                >
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
              ${currentPage === i + 1 ? 'bg-red-500 text-white' : 'bg-white'}
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
