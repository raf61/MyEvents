import BlackButton from "@/components/BlackButton";
import Container from "@/layout/Container";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EventProvider from "./EventProvider";
import EventControl from "./EventControl";

const getEvent = async (eventId) => {
  const API_BASEURL = process.env.API_BASEURL
    let event = await fetch(`${API_BASEURL}/account/events/${eventId}`, {
      headers:{
        'Cookie': cookies().toString()
      },
      'cache':'no-store'
    })
    event = await event.json()
    return event
}

export const metadata = {
  title: "Manage event"
}

export default async function ManageEvent({params: { eventId }}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isEventManager){
    return redirect('/')
  }

  let event
  try{
    event = await getEvent(eventId)  
  }
  catch(error){
    return redirect('/account/events')
  }

  return (
    <main className="p-8 pb-20">
      <Link className="absolute" href="/account/events">
        <BlackButton content="< Back"/>
      </Link>
      <Container w_class={"max-w-screen-sm"}>
        
          <EventProvider>
            <EventControl fetchedEvent={event} />
          </EventProvider>
        
      </Container>
    </main>
  )
}
