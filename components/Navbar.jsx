'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Logo from '../public/Logo1-librea.png';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    if (latest > previous && latest > 150) {
      setHidden(true);
      setShowNav(false);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      className={`fixed inset-0 top-4 w-[95%] sm:w-[90%] mx-auto bg-white to-50% shadow-lg font-medium text-slate-900 flex max-sm:justify-between gap-4 px-3 max-w-7xl items-center rounded-full font-poppins h-14 p-5 overflow-hidden`}
      variants={{
        long: { maxWidth: 950 },
        short: { maxWidth: 280 },
        hideNav: {
          height: 56,
          borderRadius: 50,
          alignItems: 'center',
          transition: { delay: 0, duration: 0.3 },
        },
        showNav: {
          height: 200,
          borderRadius: 22,
          alignItems: 'start',
          transition: { delay: 0 },
        },
      }}
      initial={'short'}
      animate={[hidden ? 'short' : 'long', showNav ? 'showNav' : 'hideNav']}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 14,
      }}
    >
      <motion.ul
        className={`w-full ${
          showNav
            ? '[--display-from:none] [--display-to:flex]'
            : 'max-sm:[--display-from:none] sm:[--display-to:flex]'
        }  [--opacity-from:0.1] [--opacity-to:1] flex-col sm:flex-row items-center justify-start gap-20 max-sm:gap-5 max-sm:pt-10`}
        variants={{
          hidden: {
            display: 'var(--display-from, none)',
            opacity: 'var(--opacity-from, 1)',
            transition: { duration: 0.1, delay: 0 },
          },
          visible: {
            display: 'var(--display-to, none)',
            opacity: 'var(--opacity-to, 1)',
            transition: { duration: 0.6, delay: 0.2 },
          },
        }}
        initial={'hidden'}
        animate={[
          hidden && !showNav ? 'hidden' : 'visible',
          showNav ? 'visible' : '',
        ]}
      >
          <Image
          src={Logo}
            alt="Hero illustration"
            width={40}
            height={20} />
        <li>
          <Link href={'#'}>
            <Button variant="ghost" className="text-slate-900">Home</Button>
          </Link>
        </li>
        <li>
          <Link href={'#skills'}>
            <Button variant="ghost" className="text-slate-900">Fitur</Button>
          </Link>
        </li>
        <li>
          <Link href={'#projects'}>
            <Button variant="ghost" className="text-slate-900">Tentang Kami</Button>
          </Link>
        </li>
        <Link href="/login">
          <Button className="px-10 py-2 bg-[#B41A1A] border-2 border-[#B41A1A] text-white rounded-xl justify-end items-end hover:bg-white hover:text-red-900 transition font-bold text-sm">
              Login
          </Button>
        </Link>
      </motion.ul>

      <motion.div
        className="w-full [--display-from:none][--display-to:inline-block]"
        variants={{
          hidden: {
            display: 'var(--display-from, none)',
            transition: { delay: 0, duration: 0.3 },
          },
          visible: {
            display: 'var(--display-to)',
            transition: { delay: 0.2, duration: 0.3 },
          },
        }}
        initial="hidden"
        animate={hidden ? 'visible' : 'hidden'}
      >
        <Button variant={'accent'} className="w-full justify-between">
          Mulai 
          
        <Link href="/signup">
          <Button className="px-10 py-2 bg-[#B41A1A] border-2 border-[#B41A1A] text-white rounded-xl hover:bg-white hover:text-red-900 transition font-bold text-sm">
              Daftar
          </Button>
        </Link>
        </Button>
      </motion.div>

      <Button
        size={'icon'}
        variant={'ghost'}
        className="rounded-full min-w-10 sm:hidden"
        onClick={() => {
          setHidden(false);
          setShowNav((prev) => !prev);
        }}
      >
        {showNav ? <ChevronUp /> : <ChevronDown />}
      </Button>
    </motion.nav>
  );
}