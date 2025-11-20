"use client"
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import BookCard from './BookCard'

export default function HomeClient({ newBooks, popularBooks, recommendedBooks, user }) {
    const categories = [
        { name: "Fiksi", icon: "mdi:book-open-page-variant", color: "from-purple-500 to-pink-500", count: 234 },
        { name: "Sains", icon: "mdi:flask", color: "from-blue-500 to-cyan-500", count: 156 },
        { name: "Sejarah", icon: "mdi:clock-outline", color: "from-orange-500 to-red-500", count: 189 },
        { name: "Teknologi", icon: "mdi:laptop", color: "from-green-500 to-emerald-500", count: 142 },
        { name: "Seni", icon: "mdi:palette", color: "from-pink-500 to-rose-500", count: 98 },
        { name: "Bahasa", icon: "mdi:translate", color: "from-indigo-500 to-purple-500", count: 167 },
    ]

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
            {/* Hero Section with Greeting */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative mb-8 rounded-3xl bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 p-8 md:p-12 overflow-hidden shadow-xl"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-white space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Selamat Datang Kembali! 👋
                            </h1>
                            <p className="text-xl text-white/90">
                                Siap melanjutkan petualangan membacamu hari ini?
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-6 pt-4"
                        >
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                                <Icon icon="mdi:book-open-variant" className="text-3xl" />
                                <div>
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-sm text-white/80">Buku Dipinjam</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                                <Icon icon="mdi:bookmark-multiple" className="text-3xl" />
                                <div>
                                    <div className="text-2xl font-bold">28</div>
                                    <div className="text-sm text-white/80">Bookmark</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                                <Icon icon="mdi:fire" className="text-3xl" />
                                <div>
                                    <div className="text-2xl font-bold">7</div>
                                    <div className="text-sm text-white/80">Hari Beruntun</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="hidden md:block"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                            <Icon icon="mdi:book-open-page-variant-outline" className="relative text-[200px] text-white/30" />
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Quick Categories */}
            <motion.section
                initial="hidden"
                animate="show"
                variants={fadeInUp}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                        Jelajahi Kategori
                    </h2>
                </div>

                <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="group cursor-pointer"
                        >
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <Icon icon={category.icon} className="text-3xl text-white" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-600">{category.count} buku</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* New Arrivals */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Buku Terbaru 🎉
                        </h2>
                        <p className="text-gray-600">Koleksi buku terbaru yang baru saja ditambahkan</p>
                    </div>
                    <Link href="/books">
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                            Lihat Semua
                            <Icon icon="mdi:arrow-right" />
                        </button>
                    </Link>
                </div>

                <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                >
                    {newBooks.map((buku) => (
                        <motion.div key={buku.id} variants={fadeInUp}>
                            <BookCard
                                id={buku.id}
                                title={buku.judul}
                                cover={buku.cover_picture}
                                category={buku.kategori}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Continue Reading Section */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                className="mb-10"
            >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 border border-purple-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Lanjutkan Membaca 📖
                            </h2>
                            <p className="text-gray-700">Buku yang sedang kamu baca</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 h-48 bg-gray-200 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                                <Image
                                    src="/bookdummy.png"
                                    alt="Current book"
                                    width={128}
                                    height={192}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Petualangan Seru di Nusantara</h3>
                                    <p className="text-gray-600">Oleh Penulis Terkenal • Fiksi</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Progress Membaca</span>
                                        <span className="font-semibold text-rose-600">65%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "65%" }}
                                            transition={{ duration: 1, delay: 0.3 }}
                                            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                                        ></motion.div>
                                    </div>
                                    <p className="text-sm text-gray-600">Halaman 156 dari 240</p>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                                    <Icon icon="mdi:book-open-variant" className="text-xl" />
                                    Lanjutkan Membaca
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Popular Books */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Sedang Populer 🔥
                        </h2>
                        <p className="text-gray-600">Buku yang paling banyak dibaca minggu ini</p>
                    </div>
                </div>

                <div className="relative">
                    <motion.div
                        variants={staggerContainer}
                        className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {popularBooks.map((buku) => (
                            <motion.div
                                key={buku.id}
                                variants={fadeInUp}
                                className="flex-shrink-0 snap-start"
                            >
                                <BookCard
                                    id={buku.id}
                                    title={buku.judul}
                                    cover={buku.cover_picture}
                                    category={buku.kategori}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Scroll Indicators */}
                    <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-rose-50 to-transparent pointer-events-none"></div>
                </div>
            </motion.section>

            {/* Recommended for You */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Rekomendasi Untukmu ✨
                        </h2>
                        <p className="text-gray-600">Berdasarkan riwayat bacaan dan minatmu</p>
                    </div>
                </div>

                <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6"
                >
                    {recommendedBooks.map((buku) => (
                        <motion.div key={buku.id} variants={fadeInUp}>
                            <BookCard
                                id={buku.id}
                                title={buku.judul}
                                cover={buku.cover_picture}
                                category={buku.kategori}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Reading Challenge CTA */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                className="mb-10"
            >
                <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Icon icon="mdi:trophy" className="text-5xl" />
                                <div>
                                    <h3 className="text-3xl font-bold">Tantangan Membaca 2025</h3>
                                    <p className="text-white/90 text-lg">Target: 50 buku dalam setahun</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Progress</span>
                                    <span className="font-semibold">12 / 50 buku</span>
                                </div>
                                <div className="w-full max-w-md h-4 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "24%" }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full bg-white rounded-full"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                        <button className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                            Lihat Detail
                        </button>
                    </div>
                </div>
            </motion.section>
        </div>
    )
}
