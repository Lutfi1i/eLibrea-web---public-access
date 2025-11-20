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
    <>
          <p>Username : <span className='font-bold'>{user?.name}</span></p>

             <Image
                src={user?.profile_picture}
                width={200}
                height={400}
                className='rounded-full'
                alt="Picture of the author"
                />
              <UploadProfile />
        <Signoutbutton />
    
    </>
            
    )
}