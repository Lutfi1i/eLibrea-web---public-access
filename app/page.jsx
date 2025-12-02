"use client"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react";
import dummyBook from "@/public/bookdummy.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from '@/components/Navbar';


export default function page() {
  const headline = "Sistem Informasi Sekolah Terpadu - Perpustakaan Digital";
    const words = headline.split(" ")

      const books = [
    {
      id: 1,
      title: "Subayana Paramita",
      cover: {dummyBook},
    },
    {
      id: 2,
      title: "Subayana Paramita",
      cover: {dummyBook},
    },
    {
      id: 3,
      title: "Subayana Paramita",
      cover: {dummyBook},
    },
  ]

   const container = {
    hidden: {},
    show: {
        transition: {
        staggerChildren: 0.2, // jeda antar buku
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
        <><div className="relative z-[9999]">
      <Navbar />
    </div>
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">

          <motion.div
            initial={{ rotateY: 90, opacity: 0 }} // Awalnya terlipat ke bawah
            animate={{ rotateY: 0, opacity: 1 }} // Terbuka penuh
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} // Sedikit delay biar muncul bergantian
            className="absolute top-200 left-0 w-[50%] h-8 bg-gradient-to-r from-[#7c0000] to-transparent -rotate-50 origin-bottom-left" />

          <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} // Sedikit delay biar muncul bergantian
            className="absolute top-200 right-0 w-[50%] h-8 bg-gradient-to-r from-transparent to-[#7c0000] rotate-50 origin-bottom-right" />

          {/* Konten utama */}
          <div className="relative text-center z-10 max-w-4xl px-2 mt-40">
            {/* Ikon buku */}
            <div className="flex justify-center mb-4">
              <img src="/symbolaj.png/" alt="book" className="w-70 h-70 bottom-70 absolute -z-999" />
            </div>

            <motion.h1
              initial={{ filter: 'blur(4px)', opacity: 0, y: 12 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[80px] text-[#B50303] font-bold">
              Mari Mulai <br />  Membaca Buku
            </motion.h1>


            {/* Subjudul */}
            <motion.p           
            initial={{ filter: 'blur(4px)', opacity: 0, y: 12 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1}}
            className="text-gray-500 mb-20 text-[20px]">
              Sistem Informasi Sekolah Terpadu - Perpustakaan Digital
            </motion.p>

            {/* Kolom pencarian */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-100">
                <span className="absolute inset-y-0 left-3 flex items-center text-red-500">
                  <Icon icon="mynaui:search" />
                </span>
                <input
                  type="text"
                  placeholder='Cari Buku "kumur"'
                  className="w-full pl-10 pr-4 py-4 w-2xl- rounded-xl bg-gray-200 bg-opacity-60 placeholder-red-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Pinjam & Baca Section */}
        <section className="bg-slate-100 px-4 py-20 mt-80">
          <div className="max-w-[1700px] mx-auto">
            <motion.div 
             initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            className="mb-12">
              <h2 className="text-[95px] mb-2">
                <span className="text-black font-bold">Pinjam <span>&</span> Baca</span>
                <span className="text-black"> Buku</span>
              </h2>
              <h3 className="text-[95px] text-black mb-4">Sekolahmu</h3>
              <p className="text-gray-600 text-xl">Sekalurmum dimana saja, kapan aja</p>
            </motion.div>

            {/* Book Cards */}
              <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
    
              {books.map((book) => (
                <motion.div
                key={book.id}
                  variants={item}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 250 }}
                    className="w-full max-w-xs overflow-hidden transition mb-10"
                  >
                    <Image
                      src={dummyBook}
                      alt={book.title || "Book"}
                      width={200}
                      height={280}
                      className="w-full object-cover" />
                    <div className="p-4 text-center">
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              </motion.div>  
            </div>
        </section>

        {/* Divider */}
        <div className="h-10 bg-gradient-to-r from-transparent via-[#7D0202] to-transparent"></div>

        {/* Kategori Section */}
        <section className="bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-20 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-black">Kategori</span>
              <span className="text-gray-400"> yang</span>
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-12">
              Beraneka <span className="font-black">Ragam</span>
            </h3>

            {/* Category Grid Placeholder */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {["Fiksi", "Non-Fiksi", "Komik", "Puisi", "Drama", "Biografi", "Sci-Fi", "Fantasy"].map((cat) => (
                <div
                  key={cat}
                  className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <p className="text-gray-700 font-medium">{cat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-50 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-black">Ayo</span>
              <span className="text-gray-400"> Buat</span>
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-8">Akumnu! Sekaranng</h3>

            <Button className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-full font-semibold">
              Mulai
            </Button>
          </div>
        </section>
      </main></>
  )
}
