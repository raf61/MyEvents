import BlackButton from "@/components/BlackButton";
import Container from "@/layout/Container";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
    title: "Developer"
}

const getDeveloperApiKey = async (eventId) => {
    try{
        const API_BASEURL = process.env.API_BASEURL
        let response = await fetch(`${API_BASEURL}/account/events/${eventId}/developer-key`, {
            cache: 'no-store',
            headers:{
                Cookie: cookies().toString()
            }
        })
        response = await response.json()
        return response.key
    }
    catch(E){
        return null
    }
}

export default async function Developer({params: {eventId}}) {


    let developerApiKey = await getDeveloperApiKey(eventId)

  return (
        <main className="mb-20">
            <div className="p-4 pb-0">
                <Link href={`/event/manage/${eventId}`}>
                    <BlackButton content={"< Back"}></BlackButton>
                </Link>
            </div>
            <Container w_class={"max-w-[40rem] p-5"}>
                    <h1 className="text-left text-4xl font-bold mt-2">👋Hi, Developer</h1>
                    <div className="flex justify-left gap-5 mt-5 items-center flex-wrap sm:flex-nowrap">
                        <div className="shadow-md border text-sm p-5 w-[100%] rounded-xl">
                            <p>In order to process the clients`s tickets on a large scale, you may need our API.</p>
                            <p>Tickets endpoint:</p>
                            <p className="text-[10pt] mb-3 font-bold">{`${process.env.API_BASEURL}/events/${eventId}/client-tickets`}</p> 
                            <p className="mb-3">This endpoint has support to pagination using <b>"page"</b> and <b>"limit"</b> query parameters.</p>
                            <p className="mb-3">You can only access it with your API key which must be sent in the request through the header "X-Event-Key". </p>
                            <p><span className="text-blue-600 font-bold">API key: </span><span className="font-bold">{developerApiKey}</span></p>
                        </div>
                    </div>

            </Container>
        </main>
  )
}
