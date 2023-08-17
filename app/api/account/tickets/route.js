import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import TicketPurchase from "@/models/TicketPurchase"
import { NextResponse } from "next/server"
import Event from "@/models/Event"
import Ticket from "@/models/Ticket"
export const dynamic = "force-dynamic"

export const GET = async (req) => {
    try {
        
        
        const session = await getServerSession(authOptions)
        if (!session?.user){
            return new Response(null, {
                status:404
            })
        }   
    
        const ticketPurchases = await TicketPurchase.find({ purchaser: session.user.id })
        .select({ ticket:true, event:true, amountPayed:true, code:true, createdAt:true })
        .populate('event', { name:true })
        .populate('ticket', { name:true, price:true })
        .sort({ createdAt: -1 })
        .lean()
        

        return NextResponse.json(ticketPurchases)
    } catch (error) {
        console.log(error)
        return NextResponse.json(null)
    }
    
}