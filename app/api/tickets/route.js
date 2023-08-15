import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import validateTicketData from "@/utils/validateTicketData"
import Event from "@/models/Event"
import { connectToDB } from "@/utils/database"
import Ticket from "@/models/Ticket"


export const POST = async (req) => {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session?.user?.isEventManager){
        return new Response(null, {
            status:403
        })
    }

    try{

        const data = await req.json()
        const validatedData = await validateTicketData(data)
        if (!validatedData.ok){
            return NextResponse.json({
                ok:false,
                msg: validatedData.msg
            })
        }
        const validatedTicket = validatedData.ticket
        
        await connectToDB()
        const ticketEvent = await Event.findOne({_id:validatedTicket.event, creator:session.user.id}).lean()
        if (!ticketEvent){
            return new Response(null, {
                status:403
            })
        }
        

        if (validatedTicket.maxQuantity > ticketEvent.ticketQuantity){
            return NextResponse.json({
                ok:false,
                msg: `The ticket max quantity must be up to ${ticketEvent.ticketQuantity}.`
            })
        }

        
        
        const newTicket = await Ticket.create({
            ...validatedTicket,
            creator: session.user.id
        })


        return NextResponse.json({
            ok:true,
            ticket: {
                ...validatedTicket,
                _id: newTicket._id
            }
        })
    }
    catch(error){
        return new Response(null, {
            status:500
        })
    }
}