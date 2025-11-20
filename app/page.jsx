"use client"
import Image from "next/image";
import spRead from "../public/sp-read.png";
import { motion } from "framer-motion";
import Navbar from '@/components/Navbar';
import dummyBook from "../public/bookdummy.png";
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function Home() {
  const headline = "Mari Mulai Membaca Buku";
  const words = headline.split(" ");

  const books = [
    {
      id: 1,
      title: "Subayana Paramita",
      author: "Penulis Terkenal",
      cover: dummyBook,
      rating: 4.5,
    },
    {
      id: 2,
      title: "Kisah Inspiratif",
      author: "Penulis Hebat",
      cover: dummyBook,
      rating: 4.8,
    },
    {
      id: 3,
      title: "Petualangan Seru",
      author: "Penulis Muda",
      cover: dummyBook,
      rating: 4.6,
    },
    {
      id: 4,
      title: "Ilmu Pengetahuan",
      author: "Profesor Ahli",
      cover: dummyBook,
      rating: 4.7,
    },
  ];

  const features = [
    {
      icon: "mdi:book-open-page-variant",
      title: "Koleksi Lengkap",
      description: "Ribuan buku dari berbagai kategori tersedia untuk dipinjam",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "mdi:clock-fast",
      title: "Akses Cepat",
      description: "Pinjam buku kapan saja, dimana saja dengan mudah",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "mdi:shield-check",
      title: "Aman & Terpercaya",
      description: "Sistem keamanan terjamin untuk melindungi data Anda",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: "mdi:account-group",
      title: "Komunitas Aktif",
      description: "Bergabung dengan ribuan pembaca lainnya",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Daftar Akun",
      description: "Buat akun gratis dalam hitungan detik",
      icon: "mdi:account-plus"
    },
    {
      number: "02",
      title: "Cari Buku",
      description: "Temukan buku favorit dari koleksi kami",
      icon: "mdi:magnify"
    },
    {
      number: "03",
      title: "Pinjam & Baca",
      description: "Pinjam buku dan mulai membaca",
      icon: "mdi:book-open-variant"
    }
  ];

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 font-poppins overflow-hidden">

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32 mt-20">
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              <div className="space-y-2">
                {words.map((word, index) => (
                  <motion.h1
                    key={index}
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 20 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                  >
                    {word}
                  </motion.h1>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg md:text-xl text-gray-600 max-w-xl"
              >
                Akses ribuan buku dari perpustakaan sekolahmu. Baca kapan saja, dimana saja dengan mudah dan gratis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/signup">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Mulai Sekarang
                      <Icon icon="mdi:arrow-right" className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>

                <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-rose-200 text-rose-600 rounded-2xl font-bold text-lg hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 hover:scale-105 shadow-md">
                  Pelajari Lebih Lanjut
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-8 pt-8"
              >
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">5000+</div>
                  <div className="text-sm text-gray-600">Buku Tersedia</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">2000+</div>
                  <div className="text-sm text-gray-600">Pengguna Aktif</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">4.8★</div>
                  <div className="text-sm text-gray-600">Rating Pengguna</div>
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <Image
                  src={spRead}
                  alt="Hero illustration"
                  className="relative w-full max-w-md lg:max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kenapa Memilih
              </span>
              <br />
              <span className="text-gray-800">Librea?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform perpustakaan digital terbaik untuk mendukung pembelajaran Anda
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon icon={feature.icon} className="text-4xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Decorative gradient border on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Popular Books Section */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Buku Populer
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi koleksi buku terpopuler yang banyak dibaca
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={item}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                <div className="relative bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Book Cover */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <button className="px-6 py-2 bg-white text-rose-600 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Lihat Detail
                      </button>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon="mdi:star"
                            className={`text-lg ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Lihat Semua Buku
            </button>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gray-800">Cara</span>
              <br />
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Menggunakan Librea
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hanya 3 langkah mudah untuk mulai membaca
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-200 via-purple-200 to-pink-200 -translate-y-1/2 -z-10"></div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="relative"
                >
                  <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group hover:-translate-y-2">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mt-8 mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon icon={step.icon} className="text-5xl text-rose-600" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold">
                Siap Memulai Petualangan Membaca?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Bergabunglah dengan ribuan pembaca lainnya dan nikmati akses ke ribuan buku berkualitas
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <button className="px-10 py-5 bg-white text-rose-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    Daftar Gratis Sekarang
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    Sudah Punya Akun?
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                  Librea
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Platform perpustakaan digital terbaik untuk mendukung pembelajaran Anda
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Icon icon="mdi:facebook" className="text-xl" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Icon icon="mdi:twitter" className="text-xl" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Icon icon="mdi:instagram" className="text-xl" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-4">Tautan Cepat</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Beranda</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tentang Kami</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Koleksi Buku</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kontak</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-bold mb-4">Dukungan</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bantuan</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kebijakan Privasi</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-lg font-bold mb-4">Hubungi Kami</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3">
                    <Icon icon="mdi:map-marker" className="text-xl text-rose-400 mt-1" />
                    <span>Jl. Pendidikan No. 123, Jakarta</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon icon="mdi:email" className="text-xl text-rose-400" />
                    <span>info@librea.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon icon="mdi:phone" className="text-xl text-rose-400" />
                    <span>+62 812-3456-7890</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>&copy; 2025 Librea. All rights reserved. Made with ❤️ for education</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
