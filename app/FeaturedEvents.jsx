'use client'

import Container from '@/layout/Container'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const getFeaturedEvents = async () => {
    try {
        const API_BASEURL = process.env.API_BASEURL
        let response = await fetch(`${API_BASEURL}/events/featured`, {
            cache: "no-store"
        })
        response = await response.json()
        if (response.ok){
            return response.events
        }
        return null
    } catch (error) {
        return null
    }
}

export default function FeaturedEvents() {
    const featuredEventsEl = useRef()
    const [featuredEvents, setFeaturedEvents] = useState('')
    const [currentFeaturedEventIndex, setCurrentFeaturedEventIndex] = useState(0)

    useEffect(() => {
        (async () => {
            setFeaturedEvents(await getFeaturedEvents())
        })()
    }, [])


    const handleEventChangePrevious = () => {
        if (currentFeaturedEventIndex == 0)
            return
        const newIndex = currentFeaturedEventIndex - 1
        const w = featuredEventsEl.current.offsetWidth
        featuredEventsEl.current.scrollTo({
            left: w * newIndex,
            behavior: 'smooth'
        })
        setCurrentFeaturedEventIndex(newIndex)
    }

    const handleEventChangeNext = () => {
        if (currentFeaturedEventIndex == featuredEvents.length - 1)
            return
        const newIndex = currentFeaturedEventIndex + 1
        const w = featuredEventsEl.current.offsetWidth
        featuredEventsEl.current.scrollTo({
            left: w * newIndex,
            behavior: 'smooth'
        })
        setCurrentFeaturedEventIndex(newIndex)
    }



  return (
    
    <Container w_class={"max-w-[60rem]"}>
        
        {
            featuredEvents && !!featuredEvents.length && 
            <div className='mt-10'>
                <h1 className='mb-5 text-xl'>Some events you may like</h1>
                <div className="">
                    <div className='flex overflow-x-hidden' ref={featuredEventsEl}>
                        {
                            featuredEvents.map (event => 
                            <div key={event._id} style={{flex:"0 0 100%"}}>

                                <div className="flex max-w-[65rem] border-2 rounded">
                                    
                                    <div className='w-[100%] md:w-[65%]'>
                                        <Link href={`${process.env.BASEURL}/event/${event.slug}/${event._id}`} target='_blank'>
                                            <img className='rounded w-[100%] h-auto' src={event.image} />
                                        </Link>
                                    </div>

                                    <div className='p-6 py-5 hidden md:block md:w-[38%]'>
                                        <p className='text-[1.5rem] uppercase line-clamp-3 mb-5'>{event.name}</p>
                                        <div className='flex justify-center'>
                                            <Link className='w-[100%]' href={`${process.env.BASEURL}/event/${event.slug}/${event._id}`} target='_blank'>
                                                <button className='rounded hover:text-white hover:border-blue-600 hover:bg-blue-500 duration-200 transition ease-in-out py-2 px-3 w-[100%] uppercase bg-white text-gray-700 border border-gray-700'>More details</button>
                                            </Link>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                            )
                        }
                    </div>

                    <div className='flex justify-center mt-5'>
                        <div className="flex justify-center gap-2">
                            <button onClick={() => handleEventChangePrevious()} className={`py-1 px-5 text-xl rounded border-2  ${currentFeaturedEventIndex != 0 ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-300"}`}>&lt;</button>
                            <button onClick={() => handleEventChangeNext()} className={`py-1 px-5 text-xl rounded border-2 ${currentFeaturedEventIndex < featuredEvents.length - 1 ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-300"}`}>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        }

        {
            typeof featuredEvents != 'object' && 
            <div className='mt-20'>
                Loading events...
            </div>
        }
    </Container>
  )
}
