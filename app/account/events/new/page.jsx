import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Container from "@/layout/Container";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {redirect} from 'next/navigation'
import NewEventForm from "./NewEventForm";
export const metadata = {
    title: "Create event"
}
export default async function NewEvent() {

    const session = await getServerSession(authOptions)
    if (!session?.user?.isEventManager){
        return redirect('/')
    }



  return (
    <main className="p-7">
        <Link href="/account/events">
            <button className="px-3 mb-3 py-2 bg-black text-white rounded">&lt; Back</button>
        </Link>

        <Container>

            <h1 className="text-3xl mb-6">New Event</h1>
            <NewEventForm />


        </Container>
    </main>
  )
}
