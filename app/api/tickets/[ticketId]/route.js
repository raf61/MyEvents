import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import Ticket from "@/models/Ticket"
import Event from "@/models/Event"
import validateTicketData from "@/utils/validateTicketData"
import { connectToDB } from "@/utils/database"
import { NextResponse } from "next/server"
import TicketPurchase from "@/models/TicketPurchase"

export const PUT = async (req, {params:{ticketId}}) => {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session?.user?.isEventManager){
        return new Response(null, {
            status: 403
        })
    }
    try{
        await connectToDB()
        const ticket = await Ticket.findOne({
            _id:ticketId,
            creator: session.user.id
        }).populate('event')

        if (!ticket){
            return new Response(null, {
                status:404
            })
        }

        const postData = await req.json()
        if (postData.price != ticket.price){
            return NextResponse.json({
                ok:false,
                msg: "The ticket price cannot be changed."
            })
        }
        const validated = validateTicketData(postData)
        Reflect.deleteProperty(validated.ticket, 'event')
        if (!validated.ok){
            return NextResponse.json({
                ok:false,
                msg: validated.msg
            })
        }
        Object.keys(validated.ticket).map(field => {
            ticket[field] = validated.ticket[field]
        })

        const ticketPurchaseCount = await TicketPurchase.count({ ticket: ticketId })

        if (validated.ticket.maxQuantity && validated.ticket.maxQuantity != ticket.maxQuantity && !ticket.event.areSalesPaused){
            return NextResponse.json({
                ok:false,
                msg: `You cannot change the ticket sales quantity limit while "Allow Purchases" is set to "ON". First, disable this option.`
            })
        }
        if (validated.ticket.maxQuantity && ticketPurchaseCount > validated.ticket.maxQuantity){
            return NextResponse.json({
                ok:false,
                msg: `${ticketPurchaseCount} tickets have already been purchased. So this ticket's sales quantity limit must be at least ${ticketPurchaseCount}. `
            })
        }
        
        if (validated.ticket.maxQuantity && validated.ticket.maxQuantity > ticket.event.ticketQuantity){
            return NextResponse.json({
                ok:false,
                msg: `This ticket's sales quantity limit must be up to ${ticket.event.ticketQuantity}.`
            })
        }


        await ticket.save()
        return NextResponse.json({
            ok: true
        })

    }
    catch(error){
        console.log(error)
        return new Response(null, {
            status:500
        })
    }
}


export const DELETE = async (req, {params:{ticketId}}) => {
    const session = await getServerSession(authOptions)
    if (!session?.user || !session?.user?.isEventManager){
        return new Response(null, {
            status: 403
        })
    }
    try{
        await connectToDB()

        const ticket = await Ticket.findOne({
            _id:ticketId,
            creator: session.user.id
        }).select({_id:true}).lean()

        if (!ticket){
            return new Response(null, {
                status:404
            })
        }

        const purchaseCount = await TicketPurchase.count({ ticket: ticket._id })
        if (purchaseCount){
            return NextResponse.json({
                ok:false,
                msg: "This type of ticket has already been purchased by someone, so it cannot be deleted."
            })
        }
        await Ticket.deleteOne({_id: ticket._id})
        return NextResponse.json({
            ok: true
        })

    }
    catch(error){
        console.log(error)
        return new Response(null, {
            status:500
        })
    }
}