import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Container from "@/layout/Container"
import { getServerSession } from "next-auth"
import Link from "next/link"
import {redirect} from 'next/navigation'
import {BiBlock} from 'react-icons/bi'
import {cookies} from 'next/headers'
import EventCard from "@/components/EventCard"
import BlackButton from "@/components/BlackButton"
export const metadata = {
  title: "My Events"
}
export default async function Event() {

  const session = await getServerSession(authOptions)
  if (!(session?.user?.isEventManager)){
    return redirect('/')
  }
  let events
  try{
    const API_BASEURL = process.env.API_BASEURL
    events = await fetch(`${API_BASEURL}/account/events`, {
      cache:'no-store',
      headers: {
        Cookie: cookies().toString()
      }
    })
    events = await events.json()
  }                
  catch(E){
    events = []
  }
  
  



  return (
    <main className="p-5 pb-20">
        <div className="p-4 pt-0 pb-0">
          <Link href={`/menu`}>
              <BlackButton content={"< Back"}></BlackButton>
          </Link>
        </div>
        <Container w_class={'max-w-screen-md'}>
          <div className="flex pt-5 items-center">
            <div className="w-[30%]"></div>
              <h1 className="text-center text-3xl w-[40%]">Events</h1>
            <div className="w-[30%] flex justify-end">
              <Link href="/account/events/new">
                <button className="py-2 px-3 rounded-full bg-blue-500 text-white text-md">+ Create</button>
              </Link>
            </div>
          </div>
          {
            !events.length && (

            <h3 className="text-center text-red-400 justify-center mt-10 text-2xl flex items-center">
              <span>
                <BiBlock size={30} />
              </span>
              <span>
              There are no events
              </span>
            </h3>
            )
          }
          <div>      
            <div className="flex w-[100%] justify-center mt-7">
              <div className="w-[100%] max-w-[30rem] border-l border-r shadow-xl rounded">
              {
                events && events.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                  ))
              }
              </div>
            </div>
          </div>
        </Container>
    </main>
  )
}
