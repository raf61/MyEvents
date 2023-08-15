import {SiEventstore} from 'react-icons/si'
import {BiUserCircle} from 'react-icons/bi'
import Container from './Container'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { Inter } from 'next/font/google'
import { authOptions } from '../app/api/auth/[...nextauth]/route'

const inter = Inter({ subsets: ['latin'] })

export default async function Nav({ hideLogo }){
    
    const session = await getServerSession(authOptions)
    const isLoggedIn = !!(session?.user)

    return (
        
        <header className='p-3 shadow_bottom'>
            <Container>
            <div className='flex justify-between items-center'>
        { !hideLogo && 
            <Link href="/">
                <p className={`flex items-center gap-2 font-bold ${inter.className}`}>
                        <span><SiEventstore size={27}/></span>
                        <span>MyEvents</span>
                </p>
            </Link>
        }
                <nav>
                    <ul className='flex items-center gap-4'>
                        {
                            isLoggedIn && (
                                <li>
                                    <Link href="/account">
                                        <BiUserCircle size={35}/>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            !isLoggedIn && (
                                <li>
                                    <Link href="/login">
                                        <button className='bg-black border border-black hover:bg-white hover:text-black transition text-white p-3 py-2 rounded-full'>Sign in</button>
                                    </Link>
                                </li>
                            )
                        }
                        
                        
                    </ul>
                </nav>
            </div>
        </Container>
        </header>
    )
}