"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import defaultNullImage from "@/public/elib-default-profile-picture.png";
import { getApiUrl } from "@/lib/api";

export default function PenggunaListPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateUserRole = async (id, newRole) => {
    if (!confirm(`Yakin ingin mengubah role menjadi ${newRole}?`)) return;

    try {
      const res = await fetch(getApiUrl(`/api/pengguna/${id}/role`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          loadUsers();
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(getApiUrl("/api/pengguna/role/users"));
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Expected array but got:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resolveProfilePicture = (path) => {
    if (!path) return null;
    if (path.startsWith("http://")) {
      return path;
    }
    if (path.startsWith("/")) {
      return path;
    }
    return `/uploads/${path}`;
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = Array.isArray(users) ? users.slice(indexOfFirst, indexOfLast) : [];
  const totalPages = Array.isArray(users) ? Math.ceil(users.length / itemsPerPage) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Pengguna</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4">Profile Picture</th>
              <th className="p-4">Username</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 w-48 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {user.profile_picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveProfilePicture(user.profile_picture)}
                        width={50}
                        height={50}
                        className="object-cover rounded-full"
                        alt="profile"
                        onError={(e) => {
                          e.target.src = defaultNullImage.src;
                        }}
                      />
                    ) : (
                      <Image
                        src={defaultNullImage}
                        width={50}
                        height={50}
                        className="object-cover rounded-full"
                        alt="No profile"
                      />
                    )}
                  </td>

                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.name || user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "petugas"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2 justify-center">  
                    <button
                      onClick={() => updateUserRole(user.id, "petugas")}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Jadikan Petugas
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  Tidak ada pengguna ditemukan.
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

