import BlackButton from "@/components/BlackButton";
import Container from "@/layout/Container";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: 'Congratulations!'
}

const getEvent = async ( eventId ) => {
    try{

        const API_BASEURL = process.env.API_BASEURL
        let event = await fetch(`${API_BASEURL}/events/${eventId}`,{
            next:{
                revalidate: 5
            }
        })
        event = await event.json()
        return event
    }
    catch(err){
        return null
    }
}

export default async function Success({searchParams:{qty, event}}) {
    qty = parseInt(qty)
    if (isNaN(qty) || qty > 5 || qty <= 0){
        return redirect('/')
    }
    const session = await getServerSession()
    if (!session?.user){
        return redirect('/')
    }
    
    const eventObj = await getEvent(event)
    if (!eventObj){
        return redirect('/')
    }
  return (
    <main>
        <Container>
            <div className="flex items-center p-5 justify-center h-[80vh]">
                <div>

                <h1 className="text-4xl text-center">
                    🎉 Congratulations, you`ve bought <span className="font-bold">{qty}</span> tickets for the event <span className="font-bold">"{eventObj.name}"</span> !🎉
                </h1>
                <p className="text-center mt-3 text-[14pt]">Get ready for a unique and unforgettable experience!</p>
                <div className="flex justify-center mt-4">
                    <Link href={"/account/tickets"}>
                        <BlackButton content={"Go to My Tickets"}/>
                    </Link>
                </div>
                </div>
            </div>
        </Container>
    </main>
  )
}
