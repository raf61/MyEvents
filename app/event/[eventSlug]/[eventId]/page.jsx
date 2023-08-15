import Container from '@/layout/Container'
import {BsFillCalendarEventFill} from 'react-icons/bs'
import TicketBar from './TicketBar'
import { notFound, redirect } from 'next/navigation'

const getEventInfo = async (eventId, eventSlug) => {
    try{

        const API_BASEURL = process.env.API_BASEURL
        let response = await fetch(`${API_BASEURL}/events/${eventId}/info`,{
            next:{
                revalidate: 5
        }
        })
        const {event, tickets} = await response.json()
        if (event.slug != eventSlug){
            return redirect(`/event/${event.slug}/${eventId}`)
        }
        if (!event){
            return notFound()
        }
        return {event, tickets}
    }
    catch(e){
        return notFound()
    }   
}


export const generateMetadata = async ({params:{eventId, eventSlug}}) => {
    const {event} = await getEventInfo(eventId, eventSlug)
    return {
        title: event.name,
        description: event.description
    }
}

export default async function EventPage({params: {eventId, eventSlug}}) {
    
    const {event, tickets} = await getEventInfo(eventId, eventSlug)
    const areSalesEnded = new Date() > new Date(event.stopSalesAt)
    const areSalesPaused = event.areSalesPaused
    const areSalesStarted = (event.startSalesAt ? new Date() > new Date(event.startSalesAt) : true)
  return (
    <main className='mb-20'>
        {
            event.image && 
        <Container w_class={"max-w-screen-2xl"}>

                <div style={{"--bg-image":`url(${event.image})`}} className={`bg-[image:var(--bg-image)] xl:h-[60vh] h-[30vh] flex justify-center relative xl:p-2 items-center w-[100%] before:w-[100%] before:h-[100%] before:absolute before:backdrop-blur-xl before:content-[""] left-0 top-0`}>
                    <div style={{"backgroundImage":`url(${event.image})`}} className='absolute w-[100%] xl:-bottom-3 md:-bottom-3 h-[100%] rounded-xl blur-none bg-contain bg-center bg-no-repeat'>
                    </div>
                </div>            
        </Container>
        }

        <Container w_class={"max-w-[56rem]"}>
                    <div className='w-[100%] sm:mt-12 flex flex-wrap justify-center p-5'>
                        <div className='w-[100%] sm:w-[60%]'>

                            <h1 className='text-left pb-3 sm:pb-5 text-2xl sm:text-2xl font-bold'>{event.name}</h1>
                            <div className='flex gap-3 items-center mt-2 mb-5 sm:mb-2'>
                                    <span className='flex gap-3 items-center'>
                                        <BsFillCalendarEventFill size={20} />
                                        <span>Sales</span>
                                    </span>
                                    <div>
                                        {
                                            event.startSalesAt && 
                                            <div className="border-b pb-2">
                                                <span><span className='font-bold'>Start</span> on {
                                                    new Date(event.startSalesAt).toLocaleString([], {
                                                    dateStyle:'full',
                                                    timeStyle:'short',
                                                    hour12:false
                                                    })
                                                }
                                                </span>
                                            </div>
                                        }
                                        <div className={`${event.startSalesAt ? "mt-2" : ""}`}>
                                            <span><span className='font-bold'>End</span> on {
                                                new Date(event.stopSalesAt).toLocaleString([], {
                                                dateStyle:'full',
                                                timeStyle:'short',
                                                hour12:false
                                                })
                                            }</span>
                                        </div>
                                    </div>
                            </div>
                            
                        </div>

                        {
                            areSalesEnded && 
                            <div className='w-[40%] flex items-center'>
                                <p className='mt-5 text-2xl text-gray-500'>Sorry, sales have ended...</p>
                            </div>
                        }
                        {
                            
                            !areSalesEnded && areSalesPaused && 
                            <div className='w-[40%] flex items-center'>
                                <p className='mt-5 text-2xl text-gray-500'>The sales are currently paused.</p>
                            </div>
                        }
                        {
                            !areSalesStarted &&
                            <div className='w-[40%] flex items-center'>
                                <p className='mt-5 text-2xl text-gray-500'>The sales have not started yet.</p>
                            </div>
                        }
                        {
                            !areSalesPaused &&
                            !areSalesEnded &&
                            areSalesStarted &&
                        <div className='w-[100%] sm:w-[40%] max-w-[20rem] relative'>
                            <div className='relative'>
                                <div className="static mt-3 sm:mt-0 sm:absolute w-[100%]">
                                    <TicketBar tickets={tickets} />
                                </div>
                            </div>
                        </div>
                        }
                        
                    </div>
                </Container>
                    <div className='pb-20'>
                    <Container w_class={"max-w-[56rem] p-5"}>

                    {   !areSalesPaused && event?.description && 
                                <>
                                

                                <div className='mt-5 max-w-[30rem]'>
                                    <h2 className='text-xl font-bold select-none'>About this event</h2>
                                    <p className='text-[11pt]'>{event.description.split('\n').map(text=>(
                                        <>
                                        {text && <span>{text}</span>}
                                        <br />
                                        </>
                                    ))}</p>
                                </div>
                            </>
                    }
                    </Container>
                    </div>


    </main>    
  )
}
