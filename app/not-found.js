"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
return <div>
    <div className='justify-center mt-20'>
        <h1 className='font-bold text-4xl text-center'>Page tidak di temukan – 403!</h1>
        <div className="flex justify-center mt-4">
            
            <button 
      type="button" 
      onClick={() => router.back()} 
      className='text-center'
    >
      Kembali
    </button>
        </div>
    </div> 
</div>
}