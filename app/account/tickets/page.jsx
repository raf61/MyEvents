import BlackButton from "@/components/BlackButton"
import Container from "@/layout/Container"
import { cookies } from "next/headers";
import Link from "next/link"
import Tickets from "./Tickets";

export const metadata = {
    title: "My Tickets"
}

export default async function MyTickets() {
    let ticketPurchases;

    try {
        const API_BASEURL = process.env.API_BASEURL
        ticketPurchases = await fetch(`${API_BASEURL}/account/tickets`, {
            cache: 'no-store',
            headers:{
                Cookie: cookies().toString()
            }
        })
        ticketPurchases = await ticketPurchases.json()

    } catch (error) {
        ticketPurchases = null
    }
  return (
    <main className="p-5">
            <Link href="/menu">
                <BlackButton content="< Back" />
            </Link>
        <Container>
            

        </Container>

        <Tickets tickets={ticketPurchases} />
    </main>
  )
}
