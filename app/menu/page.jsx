import Container from '@/layout/Container'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Link from 'next/link'
import { PiTicket } from 'react-icons/pi'
import { BiCalendar } from 'react-icons/bi'
import { RiAccountCircleFill } from 'react-icons/ri'
export default async function Menu() {
    const session = await getServerSession(authOptions)

  return (
    <main className='p-5'>
        <Container>
            <div className='flex justify-center items-center sm:h-[60vh]'>
                <div className='max-w-[25rem] py-20 justify-center gap-3 flex-wrap flex items-center p-5'>
                <Link href="/account/tickets">
                    <div className='mb-3'>
                        <button className="w-[10rem] h-[10rem] text-center gap-3 bg-blue-500 text-white p-3 py-4 rounded">
                            <div className='flex justify-center'>
                                <PiTicket size={40}/>
                            </div>
                            <span className="text-md">
                                My Tickets
                            </span>
                        </button>
                    </div>
                </Link>
                {
                    session?.user?.isEventManager == true && 
                    <Link href="/account/events">
                        <div className='mb-3'>
                        <button className="w-[10rem] h-[10rem] text-center gap-3 bg-blue-500 text-white p-3 py-4 rounded">
                                <div className="flex justify-center">
                                    <BiCalendar size={40} />
                                </div>
                                <span className="text-md">
                                    My Events
                                </span>
                            </button>
                        </div>
                    </Link>
                }
                <Link href="/account">
                    <div className='mb-3'>
                        <button className="w-[10rem] h-[10rem] text-center gap-3 bg-blue-500 text-white p-3 py-4 rounded">
                            <div className="flex justify-center">
                                <RiAccountCircleFill size={40} />
                            </div>
                            <span className="text-md">
                                Account
                            </span>
                        </button>
                    </div>
                </Link>
                </div>
            </div>
        </Container>
    </main>
  )
}
