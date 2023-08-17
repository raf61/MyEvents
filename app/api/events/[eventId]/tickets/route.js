import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Ticket from "@/models/Ticket"
import { connectToDB } from "@/utils/database"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export const GET = async (req, {params:{ eventId }}) => {
    try{

        const session = await getServerSession(authOptions)
        await connectToDB()
        const tickets = await Ticket.find({
            event:eventId
        })
        .select({ name:true, maxQuantity:true, event:true, price:true, creator:true })
        .lean()

        if (!session?.user || tickets.length && session.user.id != tickets[0].creator){
            tickets.forEach((ticket) => {
                Reflect.deleteProperty(ticket, 'maxQuantity')
                Reflect.deleteProperty(ticket, 'creator')
            })
        }


        return NextResponse.json(tickets)

    }
    
    catch(E){
        return new Response(null, {
            status:500
        })
    }
}