import BlackButton from "@/components/BlackButton";
import Container from "@/layout/Container";
import { cookies } from "next/headers";
import Link from "next/link";
import { BiBlock } from "react-icons/bi";

export const metadata = {
    title: "Financial"
}

const getFinancialInfo = async (eventId) => {
    const API_BASEURL = process.env.API_BASEURL
    let financialInfo = await fetch(`${API_BASEURL}/events/${eventId}/financial`, {
        cache: 'no-store',
        headers:{
            Cookie: cookies().toString()
        }
    })
    financialInfo = await financialInfo.json()
    return financialInfo
}

export default async function Financial({params: {eventId}}) {

    const {tickets} = await getFinancialInfo(eventId)

  return (
        <main className="mb-20">
            <div className="p-4 pb-0">
                <Link href={`/event/manage/${eventId}`}>
                    <BlackButton content={"< Back"}></BlackButton>
                </Link>
            </div>
            <Container w_class={"max-w-[40rem] p-5"}>
                    <h1 className="text-left text-4xl font-bold mt-2">Financial</h1>
                    <div className="flex justify-left gap-5 mt-5 items-center flex-wrap sm:flex-nowrap">
                        <div className="shadow-md border p-5 w-[100%] sm:w-[50%] rounded-xl">
                            <div>
                                <p className="text-xl font-bold mb-1">All sales</p>
                                <p className="text-gray-500 mb-4">Total sold in this event.</p>
                                <p className={`text-green-500 font-bold text-4xl`}>{
                                    tickets.reduce((prev, {price, numberOfSales}) => prev + price*numberOfSales, 0)
                                    .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                }</p>
                            </div>
                        </div>
                        <div className="shadow-md border p-5 w-[100%] sm:w-[50%] rounded-xl">
                            <div>
                                <p className="text-xl font-bold mb-1">Purchases</p>
                                <p className="text-gray-500 mb-4">Number of ticket purchases.</p>
                                <p className="text-blue-500 font-bold text-4xl">{
                                    tickets.reduce((prev, {price, numberOfSales}) => prev + numberOfSales, 0)
                                }</p>
                            </div>
                        </div>
                    </div>

                    <div className="shadow-md border p-5 w-[100%] mt-3 rounded-xl">
                        <p className="text-xl font-bold mb-1">Per ticket</p>
                        <p className="text-gray-500 mb-4">Sales per ticket type.</p>
                        {
                        !!tickets && tickets.map(ticket => 
                        <div className="mb-3" key={ticket._id}>
                            <div className="shadow-md border p-5 rounded-xl">
                                <p className="text-[13pt] truncate font-bold mb-1">{ticket.name}</p>
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="mb-1">Sales</p>
                                        <p className={`${ticket.numberOfSales ? 'text-green-500' : 'text-gray-500'} font-bold text-2xl`}>{
                                            (ticket.price * ticket.numberOfSales).toLocaleString('en-US', {style:'currency', currency: 'USD'})
                                        }</p>
                                    </div>
                                    <div>
                                        <p className="mb-1">Purchases</p>
                                        <p className={`${ticket.numberOfSales ? 'text-blue-500' : 'text-gray-500'} font-bold text-2xl`}>{
                                            ticket.numberOfSales
                                        }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                        }  
                        {
                            !tickets.length && 
                            <div className="flex items-center gap-2">
                                <BiBlock size={20} />
                                <span>There are no tickets.</span>
                            </div>
                        }

                    </div>

            </Container>
        </main>
  )
}
