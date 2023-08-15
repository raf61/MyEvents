import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BlackButton from "@/components/BlackButton";
import Container from "@/layout/Container";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import ManageTickets from "./ManageTickets";
import TicketProvider from "./TicketProvider";
import { cookies } from "next/headers";

export const metadata = {
  title: "Manage tickets"
}

export default async function Tickets({params:{eventId}}) {
  
  const session = await getServerSession(authOptions)

  if (!session?.user?.isEventManager){
    return redirect('/')
  }
  const API_BASEURL = process.env.API_BASEURL
  let tickets = await fetch(`${API_BASEURL}/events/${eventId}/tickets`, {
    cache:'no-store',
    headers:{
      Cookie: cookies().toString()
    }
  })
  tickets = await tickets.json()

  return (
    <main className="p-5">
      <a href={`/event/manage/${eventId}`} className="absolute">
        <BlackButton content="< Back" />
      </a>
          <h1 className="text-center mt-7 mb-7 font-bold text-3xl">Tickets</h1>
        <Container w_class={"max-w-screen-sm"}>
          <TicketProvider>
            <ManageTickets originalTickets={tickets}/>   
          </TicketProvider>
        </Container>
    </main>
  )
}
