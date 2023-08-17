import Ticket from "@/models/Ticket"
import { NextResponse } from "next/server"
import Event from '@/models/Event'
import TicketPurchase from "@/models/TicketPurchase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDB } from "@/utils/database"
export const dynamic = "force-dynamic"
export const GET = async (req, {params:{ eventId }}) => {
    const session = await getServerSession(authOptions)
    if(!session?.user){
        return new Response(null, {
            status: 403
        })
    }
    try{
        await connectToDB()
        const event = await Event.findOne({
            _id: eventId,
            creator: session.user.id
        })
        .select({
            _id: true,
        })
        .lean()
        
        if (!event){
            return new Response(null, {
                status:404
            })
        }
    

        const tickets = await Ticket.find({
            event:eventId
        })
        .select({ name:true, price:true })
        .lean()

        const numberOfSalesPerTicket = {}

        for (const ticket of tickets){
            const purchasesQuantity = await TicketPurchase.count({ticket: ticket._id})
            ticket.numberOfSales = purchasesQuantity
        }

        return NextResponse.json({
            tickets
        })

    }
    
    catch(E){
        console.log(E)
        return new Response(null, {
            status:500
        })
    }
}