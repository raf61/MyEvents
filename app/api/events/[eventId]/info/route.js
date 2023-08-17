import Ticket from "@/models/Ticket"
import { NextResponse } from "next/server"
import Event from '@/models/Event'
import TicketPurchase from "@/models/TicketPurchase"
import { connectToDB } from "@/utils/database"
export const revalidate = 2
export const GET = async (req, {params:{ eventId }}) => {
    try{
        await connectToDB()
        const event = await Event.findOne({
            _id: eventId,
        })
        .select({
            _id: true,
            name: true,
            description:true,
            slug: true,
            startSalesAt:true,
            stopSalesAt:true,
            areSalesPaused:true,
            image:true,
            ticketQuantity:true
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
        .select({ name:true, maxQuantity:true, event:true, price:true, creator:true })
        .lean()
        const allPurchasesCount = await TicketPurchase.count({event: event._id})
        const allTicketsSold = allPurchasesCount >= event.ticketQuantity
        for (const ticket of tickets){
            if (!allTicketsSold){
                const ticketPurchaseCount = await TicketPurchase.count({ticket: ticket._id})
                if (ticket.maxQuantity){
                    ticket.availableQuantity = Math.min(Math.max(ticket.maxQuantity - ticketPurchaseCount, 0), 5)
                }
                else{
                    ticket.availableQuantity = Math.min(event.ticketQuantity - allPurchasesCount, 5)
                } 
            }

            Reflect.deleteProperty(ticket, 'maxQuantity')
            Reflect.deleteProperty(ticket, 'creator')
        }
        Reflect.deleteProperty(event, 'ticketQuantity')

        return NextResponse.json({
            tickets,
            event
        })

    }
    
    catch(E){
        console.log(E)
        return new Response(null, {
            status:500
        })
    }
}